use anchor_lang::prelude::*;

declare_id!("ALNTvi8V7zPBUBVpXTNHLMQ5YehTe8FtVNKws9vMSGTG");

#[program]
pub mod supply_chain {
    use super::*;

    pub fn register_product(
        ctx: Context<RegisterProduct>,
        name: String,
        thresholds: Thresholds,
    ) -> Result<()> {
        let product = &mut ctx.accounts.product;
        product.owner = ctx.accounts.owner.key();
        product.name = name;
        product.thresholds = thresholds;
        product.latest_reading = Reading::default();
        product.reading_history = Vec::new();
        product.alert_active = false;
        product.bump = ctx.bumps.product;
        Ok(())
    }

    pub fn report_reading(
        ctx: Context<ReportReading>,
        latitude: i32,
        longitude: i32,
        temperature: i32,
        humidity: u32,
    ) -> Result<()> {
        let clock = Clock::get()?;
        let reading = Reading {
            timestamp: clock.unix_timestamp,
            latitude,
            longitude,
            temperature,
            humidity,
        };

        let product = &mut ctx.accounts.product;
        product.latest_reading = reading.clone();

        // FIFO max 20
        if product.reading_history.len() >= 20 {
            product.reading_history.remove(0);
        }
        product.reading_history.push(reading.clone());

        // Check if new reading violates thresholds
        if temperature > product.thresholds.max_temp
            || temperature < product.thresholds.min_temp
            || humidity > product.thresholds.max_humidity
            || humidity < product.thresholds.min_humidity
        {
            product.alert_active = true;
            emit!(AlertTriggered {
                product: product.key(),
                reading: reading.clone(),
            });
        }

        emit!(ReadingReported {
            product: product.key(),
            reading,
        });

        Ok(())
    }

    pub fn set_thresholds(
        ctx: Context<SetThresholds>,
        new_thresholds: Thresholds,
    ) -> Result<()> {
        let product = &mut ctx.accounts.product;
        require!(
            product.owner == ctx.accounts.owner.key(),
            SupplyChainError::Unauthorized
        );
        product.thresholds = new_thresholds;

        // Re-evaluate alert based on latest reading
        if product.latest_reading.timestamp != 0 {
            let temp = product.latest_reading.temperature;
            let hum = product.latest_reading.humidity;
            if temp > product.thresholds.max_temp
                || temp < product.thresholds.min_temp
                || hum > product.thresholds.max_humidity
                || hum < product.thresholds.min_humidity
            {
                product.alert_active = true;
            } else {
                product.alert_active = false;
            }
        }

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct RegisterProduct<'info> {
    #[account(
        init,
        payer = owner,
        // space = discriminator(8) + owner(32) + name_len(4) + max_name(50) + thresholds(16) + latest_reading(24) + vec_len(4) + 20*reading(480) + alert(1) + bump(1)
        space = 8 + 32 + 4 + 50 + 16 + 24 + 4 + 480 + 1 + 1,
        seeds = [b"product", owner.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub product: Account<'info, Product>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReportReading<'info> {
    #[account(mut)]
    pub product: Account<'info, Product>,
    // For simplicity in a simulated environment, any valid signer can report, 
    // or you could restrict it to a specific `sensor` pubkey stored on the account.
    pub authority: Signer<'info>, 
}

#[derive(Accounts)]
pub struct SetThresholds<'info> {
    #[account(mut, has_one = owner)]
    pub product: Account<'info, Product>,
    pub owner: Signer<'info>,
}

#[account]
pub struct Product {
    pub owner: Pubkey,          // 32
    pub name: String,            // 4 + length
    pub thresholds: Thresholds,  // 16
    pub latest_reading: Reading, // 24
    pub reading_history: Vec<Reading>, // 4 + N * 24
    pub alert_active: bool,      // 1
    pub bump: u8,                // 1
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct Thresholds {
    pub max_temp: i32,    // 4
    pub min_temp: i32,    // 4
    pub max_humidity: u32, // 4
    pub min_humidity: u32, // 4
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct Reading {
    pub timestamp: i64,        // 8
    pub latitude: i32,          // 4
    pub longitude: i32,         // 4
    pub temperature: i32,       // 4
    pub humidity: u32,          // 4
}

#[event]
pub struct ReadingReported {
    pub product: Pubkey,
    pub reading: Reading,
}

#[event]
pub struct AlertTriggered {
    pub product: Pubkey,
    pub reading: Reading,
}

#[error_code]
pub enum SupplyChainError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Invalid thresholds provided.")]
    InvalidThreshold,
}
