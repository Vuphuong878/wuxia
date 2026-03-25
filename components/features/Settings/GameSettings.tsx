import React, { useEffect, useRef, useState } from 'react';
import { GameSettings as GameSettingsType } from '../../../types';
import GameButton from '../../ui/GameButton';
import ToggleSwitch from '../../ui/ToggleSwitch';
import InlineSelect from '../../ui/InlineSelect';
import ParallelogramSaveButton from '../../ui/ParallelogramSaveButton';

interface Props {
    settings: GameSettingsType;
    onSave: (settings: GameSettingsType) => void;
}

const GameSettings: React.FC<Props> = ({ settings, onSave }) => {
    const [form, setForm] = useState<GameSettingsType>(settings);
    const [showSuccess, setShowSuccess] = useState(false);
    const [openMenu, setOpenMenu] = useState<'perspective' | 'style' | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const narrativePersonOptions: Array<{ value: GameSettingsType['narrativePerspective']; label: string }> = [
        { value: 'Ngôi thứ nhất', label: 'Ngôi thứ ba giới hạn' },
        { value: 'Ngôi thứ hai', label: 'Ngôi thứ hai' },
        { value: 'Ngôi thứ ba', label: 'Ngôi thứ ba Toàn tri' }
    ];

    const storyStyleOptions: Array<{ value: GameSettingsType['storyStyle']; label: string }> = [
        { value: 'Tu luyện', label: 'Tu luyện' },
        { value: 'Thông thường', label: 'Thông thường' },
        { value: 'Tu la tràng', label: 'Tu la tràng' },
        { value: 'Tu Tiên Ưu Ám', label: 'Tu Tiên Ưu Ám' }
    ];

    useEffect(() => {
        setForm(settings);
    }, [settings]);

    useEffect(() => {
        if (!openMenu) return;

        const handlePointerDown = (event: MouseEvent) => {
            const root = rootRef.current;
            if (!root) return;
            if (event.target instanceof Node && root.contains(event.target)) return;
            setOpenMenu(null);
        };
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpenMenu(null);
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [openMenu]);

    const handleSave = () => {
        onSave(form);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const realTimeUpdates = (patch: Partial<GameSettingsType>) => {
        const next = { ...form, ...patch };
        setForm(next);
        onSave(next);
    };

    const handleChange = (key: keyof GameSettingsType, value: any) => {
        realTimeUpdates({ [key]: value });
    };

    const ToggleCard = ({ title, desc, checked, onChange }: { title: string, desc: string, checked: boolean, onChange: (c: boolean) => void }) => (
        <div
            onClick={() => onChange(!checked)}
            className="rounded-md border border-wuxia-gold/10 bg-paper-white/5 p-4 hover:border-wuxia-gold/50 transition-colors cursor-pointer group"
        >
            <div className="flex items-start justify-between gap-4 pointer-events-none">
                <div className="flex-1 pr-4">
                    <div className="text-sm text-wuxia-gold/90 font-bold tracking-wide group-hover:text-wuxia-gold">{title}</div>
                    <div className="text-xs text-paper-white/50 font-medium mt-1 leading-relaxed">{desc}</div>
                </div>
                <div className="shrink-0 flex items-center mt-1">
                    <ToggleSwitch checked={checked} onChange={onChange} ariaLabel={title} />
                </div>
            </div>
        </div>
    );

    return (
        <div ref={rootRef} className="space-y-6 animate-fadeIn pb-10">
            <div className="flex justify-between items-end border-b border-wuxia-gold/30 pb-4">
                <div className="space-y-1">
                    <h3 className="text-wuxia-gold font-sans font-black text-2xl tracking-tighter text-shadow-gold">Cài đặt trò chơi</h3>
                    <p className="text-[10px] text-wuxia-gold/60 tracking-[0.3em] font-bold uppercase pl-1">Game Settings</p>
                </div>
                {showSuccess && (
                    <div className="text-[10px] font-bold animate-pulse px-3 py-1 bg-wuxia-gold/10 border border-wuxia-gold/30 rounded-full text-wuxia-gold">
                        Đã lưu cài đặt
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-8">
                <div className="space-y-2">
                    <label className="text-sm text-wuxia-gold font-bold tracking-wide">Yêu cầu số từ</label>
                    <input
                        type="number"
                        min={50}
                        step={10}
                        value={form.bodyLengthRequirement}
                        onChange={(e) => {
                            const n = Number(e.target.value);
                            realTimeUpdates({ bodyLengthRequirement: Number.isFinite(n) && n > 0 ? Math.max(50, Math.floor(n)) : 3000 });
                        }}
                        className="w-full bg-transparent border border-wuxia-gold/10 focus:border-wuxia-gold p-3 text-paper-white text-sm outline-none rounded-md transition-all font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-wuxia-gold font-bold tracking-wide">Góc nhìn trần thuật</label>
                    <InlineSelect
                        value={form.narrativePerspective}
                        options={narrativePersonOptions}
                        onChange={(value) => realTimeUpdates({ narrativePerspective: value as GameSettingsType['narrativePerspective'] })}
                        buttonClassName="bg-transparent border-wuxia-gold/20 hover:border-wuxia-gold/40 py-2.5"
                    />
                </div>

                <div className="space-y-2 col-span-2">
                    <label className="text-sm text-wuxia-gold font-bold tracking-wide">Phong cách câu chuyện</label>
                    <InlineSelect
                        value={form.storyStyle}
                        options={storyStyleOptions}
                        onChange={(value) => realTimeUpdates({ storyStyle: value as GameSettingsType['storyStyle'] })}
                        buttonClassName="bg-transparent border-wuxia-gold/20 hover:border-wuxia-gold/40 py-2.5"
                    />
                    <div className="text-xs text-paper-white/40 font-medium mt-1">Sẽ được tiêm vào cuối ngữ cảnh vòng này dưới dạng tin nhắn Trợ lý AI, trước tin nhắn lịch sử COT giả.</div>
                </div>


            </div>

            <div className="space-y-3">
                <ToggleCard
                    title="Tùy chọn hành động"
                    desc="Khi bật, sẽ tiêm vào ngữ cảnh đặc tả 'Tùy chọn hành động' và yêu cầu xuất thẻ `<Action options>`."
                    checked={form.enableActionOptions !== false}
                    onChange={(next) => realTimeUpdates({ enableActionOptions: next })}
                />
                <ToggleCard
                    title="Ngăn nói thay (NoControl)"
                    desc="Khi bật, thêm Prompt 'Ngăn nói thay / Ranh giới nhân vật', cấm viết thay lời thoại và hành động của người chơi."
                    checked={form.enablePreventSpeaking !== false}
                    onChange={(next) => realTimeUpdates({ enablePreventSpeaking: next })}
                />
                <ToggleCard
                    title="Tiêm lịch sử COT giả"
                    desc="Khi bật, sẽ tiêm một tin nhắn lịch sử ngụy trang sau lệnh `user:Bắt đầu nhiệm vụ`, nhằm củng cố thói quen xuất đoạn suy nghĩ."
                    checked={form.enablePseudoCotInjection !== false}
                    onChange={(next) => realTimeUpdates({ enablePseudoCotInjection: next })}
                />
                <ToggleCard
                    title="Chế độ Claude"
                    desc="Khi bật, tải ngữ cảnh theo thứ tự thông thường; ngoại trừ 'Đầu vào mới nhất' dùng nhận dạng `user`, tất cả còn lại dùng `system`; đồng thời xóa các prompt yêu cầu bổ sung."
                    checked={form.enableClaudeMode === true}
                    onChange={(next) => realTimeUpdates({ enableClaudeMode: next })}
                />
                <ToggleCard
                    title="Yêu cầu xuất tuyên bố miễn trách"
                    desc="Khi bật, AI sẽ thêm một đoạn tuyên bố miễn trách độc lập ở cuối vòng này; sẽ không được chèn vào giữa nội dung."
                    checked={form.enableDisclaimerOutput !== false}
                    onChange={(next) => realTimeUpdates({ enableDisclaimerOutput: next })}
                />
                <ToggleCard
                    title="Kiểm tra toàn vẹn thẻ"
                    desc="Khi bật, hệ thống kiểm tra xem 3 thẻ `<Main Body>`/`<Short-term memory>`/`<Command>` có đầy đủ không; dữ liệu không đầy đủ sẽ báo lỗi và ngừng ghi."
                    checked={form.enableTagIntegrityCheck === true}
                    onChange={(next) => realTimeUpdates({ enableTagIntegrityCheck: next })}
                />
                <ToggleCard
                    title="Tự động sửa thẻ"
                    desc="Khi bật, hệ thống tự động sửa các lỗi thẻ phổ biến trước khi phân tích (như thẻ trùng lặp, thiếu thẻ đóng)."
                    checked={form.enableTagAutoFix !== false}
                    onChange={(next) => realTimeUpdates({ enableTagAutoFix: next })}
                />
                <ToggleCard
                    title="Tự động thử lại khi lỗi"
                    desc="Khi bật, tự động thử lại khi có lỗi tạo hoặc phân tích, tối đa 3 lần; không vào vùng sửa lỗi hoặc hộp thoại xác nhận thử lại."
                    checked={form.enableRetryOnParseFail !== false}
                    onChange={(next) => realTimeUpdates({ enableRetryOnParseFail: next })}
                />


                <div className="col-span-1 md:col-span-2 mt-4">
                    <ToggleCard
                        title="Prompt bổ sung (Custom Prompt)"
                        desc="Nếu bật, nội dung prompt bên dưới sẽ được gửi kèm trong mỗi yêu cầu gửi đến AI."
                        checked={form.enableExtraPrompt === true}
                        onChange={(next) => realTimeUpdates({ enableExtraPrompt: next })}
                    />
                    {form.enableExtraPrompt && (
                        <div className="mt-3 animate-fadeIn">
                            <textarea
                                value={form.extraPrompt || ''}
                                onChange={(e) => realTimeUpdates({ extraPrompt: e.target.value })}
                                placeholder="Nhập prompt bổ sung của bạn tại đây..."
                                className="w-full bg-ink-black/40 border border-wuxia-gold/20 rounded-lg p-3 text-sm text-paper-white/90 min-h-[120px] focus:border-wuxia-gold/50 transition-all outline-none"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4 sticky bottom-0 bg-ink-black/80 backdrop-blur-md pb-4 z-20">
                <ParallelogramSaveButton
                    onClick={handleSave}
                    className="w-full"
                />
            </div>
        </div>
    );
};

export default GameSettings;

