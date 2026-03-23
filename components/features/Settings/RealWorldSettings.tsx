import React, { useState } from 'react';
import { GameSettings } from '../../../types';
import ToggleSwitch from '../../ui/ToggleSwitch';
import GameButton from '../../ui/GameButton';

interface Props {
    settings: GameSettings;
    onSave: (settings: GameSettings) => void;
}

const RealWorldSettings: React.FC<Props> = ({ settings, onSave }) => {
    const [form, setForm] = useState<GameSettings>(settings);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleToggle = (val: boolean) => {
        setForm(prev => ({ ...prev, enableRealWorldMode: val }));
    };

    const handleSave = () => {
        onSave(form);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    return (
        <div className="flex flex-col gap-6 animate-fadeIn h-full p-4 overflow-y-auto">
            <div className="bg-black/40 border border-wuxia-gold/20 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-wuxia-gold mb-4 flex items-center gap-2">
                    <span className="text-2xl"></span> Chế độ Thế giới thực
                </h3>

                <p className="text-gray-300 mb-6 leading-relaxed">
                    Khi kích hoạt, thế giới sẽ vận hành theo các quy luật thực tế nghiêm ngặt.
                    Mọi diễn biến, chiến đấu và tương tác sẽ tuân thủ logic vật lý, sinh học và nhân quả.
                    Tuyệt đối không có các tình tiết phi logic hoặc tăng sức mạnh vô căn cứ.
                </p>

                <div className="flex items-center justify-between p-4 bg-wuxia-gold/5 rounded-lg border border-wuxia-gold/10">
                    <div>
                        <div className="text-lg font-medium text-white">Kích hoạt Chế độ Thực tế</div>
                        <div className="text-sm text-gray-400">Thiết lập thế giới theo logic Thiên Đạo Vận Hành.</div>
                    </div>
                    <ToggleSwitch
                        checked={!!form.enableRealWorldMode}
                        onChange={handleToggle}
                        color="gold"
                    />
                </div>
            </div>

            <div className="mt-auto flex items-center justify-between bg-black/60 p-4 border-t border-wuxia-gold/20 sticky bottom-0">
                <div className="text-sm text-wuxia-gold/60 italic">
                    * Lưu ý: Chế độ này sẽ ảnh hưởng đến cách AI dẫn dắt câu chuyện.
                </div>
                <div className="flex items-center gap-4">
                    {showSuccess && (
                        <span className="text-green-400 animate-fadeInOut font-medium">
                            Đã lưu thành công!
                        </span>
                    )}
                    <GameButton
                        onClick={handleSave}
                        variant="primary"
                        size="md"
                    >
                        Lưu cấu hình
                    </GameButton>
                </div>
            </div>
        </div>
    );
};

export default RealWorldSettings;
