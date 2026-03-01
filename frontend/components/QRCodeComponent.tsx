import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export const QRCodeComponent: React.FC<{ url: string }> = ({ url }) => {
    return (
        <div className="bg-white p-4 rounded-xl inline-block shadow-lg border-2 border-primary/20">
            <QRCodeCanvas
                value={url}
                size={180}
                bgColor={"#ffffff"}
                fgColor={"#0f1115"}
                level={"H"}
                includeMargin={false}
            />
        </div>
    );
};
