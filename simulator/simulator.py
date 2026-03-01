import sys
import json
import time
import random
import asyncio
from solana.rpc.async_api import AsyncClient
from solana.transaction import Transaction
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.instruction import Instruction, AccountMeta
import random

import os

# Replace with your local devnet or localhost RPC
RPC_URL = "https://api.devnet.solana.com"
# Updated to match the actually deployed program ID
PROGRAM_ID = Pubkey.from_string("ALNTvi8V7zPBUBVpXTNHLMQ5YehTe8FtVNKws9vMSGTG")

def interpolate(p1, p2, f):
    return {
        "lat": p1["lat"] + (p2["lat"] - p1["lat"]) * f,
        "lon": p1["lon"] + (p2["lon"] - p1["lon"]) * f
    }

def load_keypair():
    """Load the default Solana CLI keypair if it exists."""
    path = os.path.expanduser("~/.config/solana/id.json")
    if os.path.exists(path):
        try:
            with open(path, "r") as f:
                secret = json.load(f)
            return Keypair.from_bytes(bytes(secret))
        except Exception as e:
            print(f"Error loading keypair from {path}: {e}")
    return Keypair()

async def send_report(client, keypair, product_pubkey, data):
    print(f"Reporting: Lat: {data['lat']:.4f}, Lon: {data['lon']:.4f}, Temp: {data['temp']}°C, Hum: {data['hum']}%")
    
    # Calculate Anchor discriminator for "global:report_reading"
    import hashlib
    m = hashlib.sha256()
    m.update(b"global:report_reading")
    discriminator = m.digest()[:8]
    
    # Pack parameters: latitude(i32), longitude(i32), temperature(i32), humidity(u32)
    import struct
    latitude = int(data['lat'] * 1e7)
    longitude = int(data['lon'] * 1e7)
    temp = int(data['temp'] * 100)
    hum = int(data['hum'] * 100)
    
    ix_data = discriminator + struct.pack("<iiiI", latitude, longitude, temp, hum)
    
    ix = Instruction(
        program_id=PROGRAM_ID,
        data=ix_data,
        accounts=[
            AccountMeta(pubkey=product_pubkey, is_signer=False, is_writable=True),
            AccountMeta(pubkey=keypair.pubkey(), is_signer=True, is_writable=False),
        ]
    )

    try:
        # Simple transaction construction for solana-py 0.32.0+
        tx = Transaction()
        tx.add(ix)
        
        # This will sign and send in one go
        resp = await client.send_transaction(tx, keypair)
        print(f"✓ Reading reported! Signature: {resp.value}")
        
    except Exception as e:
        print(f"Error sending reading: {e}")
        print("Tip: Make sure your wallet has devnet SOL. Run: solana airdrop 1 --url devnet")

async def main():
    print("Starting IoT Simulator...")
    
    if not os.path.exists("route.json"):
        print("Error: route.json not found.")
        return

    with open("route.json", "r") as f:
        route = json.load(f)

    # Use the CLI keypair so it has funds
    keypair = load_keypair()
    print(f"Using reporter wallet: {keypair.pubkey()}")
    
    # You will need to input your actual generated product PDA pubkey
    product_pda = input("Enter Product PDA Pubkey (from frontend): ")
    if not product_pda:
        print("Error: Product PDA is required.")
        return
    
    try:
        product_pubkey = Pubkey.from_string(product_pda)
    except Exception as e:
        print(f"Invalid Pubkey: {e}")
        return

    client = AsyncClient(RPC_URL)
    
    for i in range(len(route) - 1):
        start = route[i]
        end = route[i+1]
        
        steps = 10
        for step in range(steps):
            f = step / steps
            current_pos = interpolate(start, end, f)
            
            # Generate dummy data
            # Realistic temp 2 to 8 C, humidity 60-90%
            temp = random.uniform(2.0, 8.0)
            hum = random.uniform(60.0, 90.0)
            
            # Simulate a spike sometimes
            if random.random() < 0.1:
                temp = random.uniform(10.0, 15.0)
                
            data = {
                "lat": current_pos["lat"],
                "lon": current_pos["lon"],
                "temp": round(temp, 2),
                "hum": round(hum, 2)
            }
            
            await send_report(client, keypair, product_pubkey, data)
            await asyncio.sleep(5)
            
    await client.close()
    print("Simulation finished.")

if __name__ == "__main__":
    asyncio.run(main())
