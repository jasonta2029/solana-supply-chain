import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export const QRCodeComponent: React.FC<{ url: string }> = ({ url }) => {
    return (
        <div className="bg-white p-3 rounded-2xl inline-block shadow-sm border border-border">
            <div className="bg-white rounded-xl overflow-hidden p-2">
                <QRCodeCanvas
                    value={url}
                    size={120}
                    bgColor={"#ffffff"}
                    fgColor={"#0f172a"}
                    level={"H"}
                    includeMargin={false}
                />
            </div>
        </div>
    );
};
