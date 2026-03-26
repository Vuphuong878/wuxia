
import React, { useRef, useState } from 'react';
import IconGlyph from '../../ui/Icon/IconGlyph';

/** Maximum total attempts (initial + retries) when enableRetryOnParseFail is active. */
const MAX_SEND_ATTEMPTS = 3;

type QuickRestartMode = 'world_only' | 'opening_only' | 'all';

type SendResult = {
    cancelled?: boolean;
    attachedRecallPreview?: string;
    preparedRecallTag?: string;
    needRecallConfirm?: boolean;
    needRerollConfirm?: boolean;
    parseErrorMessage?: string;
    parseErrorDetail?: string;
    errorDetail?: string;
    errorTitle?: string;
};

type RecallProgress = {
    phase: 'start' | 'stream' | 'done' | 'error';
    text?: string;
};

interface Props {
    onSend: (
        content: string,
        isStreaming: boolean,
        options?: { onRecallProgress?: (progress: RecallProgress) => void }
    ) => Promise<SendResult> | SendResult;
    onStop: () => void;
    onRegenerate: () => string | null;
    onQuickRestart?: (mode: QuickRestartMode) => void | Promise<void>;
    requestConfirm?: (options: { title?: string; message: string; confirmText?: string; cancelText?: string; danger?: boolean }) => Promise<boolean>;
    loading: boolean;
    canReroll?: boolean;
    canQuickRestart?: boolean;
    options?: unknown[]; // Quick actions from the last turn
    enableRetryOnParseFail?: boolean;
    initialValue?: string;
    onInitialValueConsumed?: () => void;
}

const InputArea: React.FC<Props> = ({
    onSend,
    onStop,
    onRegenerate,
    onQuickRestart,
    requestConfirm,
    loading,
    canReroll = true,
    canQuickRestart = false,
    options = [],
    enableRetryOnParseFail = true,
    initialValue,
    onInitialValueConsumed
}) => {
    const [content, setContent] = useState('');

    React.useEffect(() => {
        if (initialValue) {
            setContent(initialValue);
            onInitialValueConsumed?.();
        }
    }, [initialValue, onInitialValueConsumed]);

    const [isStreaming, setIsStreaming] = useState(false);
    const [lastSentContent, setLastSentContent] = useState('');
    const [isPreparing, setIsPreparing] = useState(false);
    const [attachedRecallPreview, setAttachedRecallPreview] = useState('');
    const [showAttachedRecall, setShowAttachedRecall] = useState(false);
    const [pendingRecallTag, setPendingRecallTag] = useState('');
    const [recallProgress, setRecallProgress] = useState<RecallProgress | null>(null);
    const [showQuickRestartMenu, setShowQuickRestartMenu] = useState(false);
    const [showActionOptions, setShowActionOptions] = useState(true);
    const [errorModal, setErrorModal] = useState<{ open: boolean; title: string; content: string }>({
        open: false,
        title: '',
        content: ''
    });
    const quickActionsRef = useRef<HTMLDivElement | null>(null);
    const dragRef = useRef({ active: false, startX: 0, startScrollLeft: 0, moved: false });
    const suppressClickUntilRef = useRef(0);

    const handleSend = async (overrideContent?: string) => {
        const textToSend = typeof overrideContent === 'string' ? overrideContent : content;
        if (!textToSend.trim()) return;
        if (loading || isPreparing) return;
        setIsPreparing(true);
        setRecallProgress(null);
        const maxAttempts = enableRetryOnParseFail ? MAX_SEND_ATTEMPTS : 1;
        try {
            let currentInput = textToSend;
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const payload = pendingRecallTag
                    ? `${currentInput}\n<Ký ức cốt truyện>\n${pendingRecallTag}\n</Ký ức cốt truyện>`
                    : currentInput;
                const result = await onSend(payload, isStreaming, {
                    onRecallProgress: (progress) => setRecallProgress(progress)
                });
                if (result?.cancelled) {
                    if (result.needRerollConfirm) {
                        // Auto-retry on parse failure when not on last attempt
                        if (attempt < maxAttempts - 1) {
                            const restoredInput = onRegenerate();
                            if (restoredInput) {
                                currentInput = restoredInput;
                                continue;
                            }
                        }
                        // All retries exhausted or can't restore — ask user
                        const parseErrorText = result.parseErrorDetail || result.parseErrorMessage || 'Mô hình trả về nội dung không tuân thủ giao thức thẻ.';
                        const confirmed = requestConfirm
                            ? await requestConfirm({
                                title: 'Phân tích phản hồi thất bại',
                                message: `${parseErrorText}\n\nKhởi động lại ngay? ROLL và điền lại đầu vào cuối cùng?`,
                                confirmText: 'Làm lại',
                                cancelText: 'Hủy'
                            })
                            : false;
                        if (confirmed) {
                            handleReroll();
                        }
                        return;
                    }
                    if (result.needRecallConfirm && result.preparedRecallTag) {
                        const confirmed = requestConfirm
                            ? await requestConfirm({
                                title: 'Xác nhận ký ức cốt truyện',
                                message: `Các ký ức sau sẽ được điền vào phần đính kèm đầu vào：\n\n${result.attachedRecallPreview || 'Ký ức mạnh:Không\nKý ức yếu:Không'}`,
                                confirmText: 'Xác nhận điền',
                                cancelText: 'Hủy'
                            })
                            : false;
                        if (confirmed) {
                            setPendingRecallTag(result.preparedRecallTag);
                            if (result.attachedRecallPreview) {
                                setAttachedRecallPreview(result.attachedRecallPreview);
                                setShowAttachedRecall(false);
                            }
                        } else if (result.attachedRecallPreview) {
                            setAttachedRecallPreview(result.attachedRecallPreview);
                            setShowAttachedRecall(false);
                        }
                        return;
                    }
                    if (result.preparedRecallTag) {
                        setPendingRecallTag(result.preparedRecallTag);
                    }
                    if (result.attachedRecallPreview) {
                        setAttachedRecallPreview(result.attachedRecallPreview);
                        setShowAttachedRecall(false);
                    }
                    if (result.errorDetail) {
                        setErrorModal({
                            open: true,
                            title: result.errorTitle || 'Yêu cầu thất bại',
                            content: result.errorDetail
                        });
                    }
                    return;
                }
                setLastSentContent(currentInput);
                setContent('');
                setPendingRecallTag('');
                if (result?.attachedRecallPreview) {
                    setAttachedRecallPreview(result.attachedRecallPreview);
                    setShowAttachedRecall(false);
                } else {
                    setAttachedRecallPreview('');
                    setShowAttachedRecall(false);
                }
                setRecallProgress(null);
                return;
            }
        } finally {
            setIsPreparing(false);
        }
    };

    const handleStop = () => {
        onStop();
        setContent(lastSentContent);
    };

    const handleOptionClick = (opt: string) => {
        if (Date.now() < suppressClickUntilRef.current) return;
        setContent(opt);
    };

    const handleReroll = () => {
        const restoredInput = onRegenerate();
        if (!restoredInput) return;
        setContent(restoredInput);
        setLastSentContent(restoredInput);
    };

    const handleQuickRestartSelect = async (mode: QuickRestartMode) => {
        if (!onQuickRestart) return;
        const optionsMap: Record<QuickRestartMode, { title: string; message: string }> = {
            world_only: {
                title: 'Tạo lại thế giới quan',
                message: 'Chỉ tạo lại prompt thế giới quan, không tự tạo cốt truyện mở đầu. Tiếp tục?'
            },
            opening_only: {
                title: 'Tạo lại cốt truyện mở đầu',
                message: 'Cốt truyện mở đầu sẽ được tạo lại bằng thế giới quan hiện tại (lệnh có biến). Tiếp tục?'
            },
            all: {
                title: 'Tạo lại thế giới quan + Cốt truyện mở đầu',
                message: 'Sẽ chạy lại hoàn toàn thế giới quan và cốt truyện mở đầu. Tiếp tục?'
            }
        };
        const option = optionsMap[mode];
        const confirmed = requestConfirm
            ? await requestConfirm({
                title: option.title,
                message: option.message,
                confirmText: 'Thực hiện ngay',
                cancelText: 'Hủy',
                danger: true
            })
            : true;
        if (!confirmed) return;
        await Promise.resolve(onQuickRestart(mode));
        setShowQuickRestartMenu(false);
    };

    const handleQuickActionsPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== 'mouse') return;
        const el = quickActionsRef.current;
        if (!el) return;
        if (el.scrollWidth <= el.clientWidth) return;
        dragRef.current = {
            active: true,
            startX: e.clientX,
            startScrollLeft: el.scrollLeft,
            moved: false
        };
        e.currentTarget.setPointerCapture?.(e.pointerId);
    };

    const handleQuickActionsPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== 'mouse') return;
        if (!dragRef.current.active) return;
        const el = quickActionsRef.current;
        if (!el) return;
        const delta = e.clientX - dragRef.current.startX;
        if (Math.abs(delta) > 4) {
            dragRef.current.moved = true;
        }
        el.scrollLeft = dragRef.current.startScrollLeft - delta;
        if (dragRef.current.moved) {
            e.preventDefault();
        }
    };

    const endQuickActionsDrag = () => {
        if (!dragRef.current.active) return;
        if (dragRef.current.moved) {
            suppressClickUntilRef.current = Date.now() + 120;
        }
        dragRef.current.active = false;
    };

    const normalizeOptionText = (opt: unknown): string => {
        if (typeof opt === 'string') return opt.trim();
        if (typeof opt === 'number' || typeof opt === 'boolean') return String(opt);
        if (opt && typeof opt === 'object') {
            const obj = opt as Record<string, unknown>;
            const candidate = obj.text ?? obj.label ?? obj.action ?? obj.name ?? obj.id;
            if (typeof candidate === 'string') return candidate.trim();
        }
        return '';
    };

    const normalizedOptions = options
        .map(normalizeOptionText)
        .filter(item => item.length > 0);

    const busy = loading || isPreparing;

    const handleQuickAction = (text: string) => {
        if (busy) return;
        handleSend(text);
    };

    return (
        <div className="shrink-0 relative z-20 bg-gradient-to-t from-ink-black via-ink-black/95 to-transparent pb-4 px-4 flex flex-col gap-2">

            {/* AI Streaming Draft Status Area */}
            {(busy || recallProgress || attachedRecallPreview) && (
                <div className="relative overflow-hidden rounded-xl border border-wuxia-gold/20 bg-gradient-to-br from-gray-900/90 via-ink-black/95 to-gray-900/90 shadow-2xl backdrop-blur-md transition-all duration-500">
                    {/* Pulsing Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-wuxia-gold/5 via-transparent to-wuxia-gold/5 animate-pulse opacity-30"></div>
                    
                    <div className="relative p-3 space-y-2">
                        <div className="flex items-center justify-between border-b border-wuxia-gold/10 pb-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${busy ? 'bg-wuxia-gold animate-ping' : 'bg-gray-600'}`}></div>
                                <span className="text-[10px] font-bold text-wuxia-gold/80 tracking-widest uppercase">
                                    {loading ? 'Đang viết bản thảo...' : isPreparing ? 'Đang thẩm định ký ức...' : 'Trạng thái AI'}
                                </span>
                            </div>
                            {busy && (
                                <div className="flex gap-1">
                                    <div className="w-1 h-3 bg-wuxia-gold/40 animate-[bounce_1s_infinite_0ms]"></div>
                                    <div className="w-1 h-3 bg-wuxia-gold/60 animate-[bounce_1s_infinite_200ms]"></div>
                                    <div className="w-1 h-3 bg-wuxia-gold/40 animate-[bounce_1s_infinite_400ms]"></div>
                                </div>
                            )}
                        </div>

                        {recallProgress && (
                            <div className="text-[11px] text-wuxia-cyan/90 font-medium animate-in fade-in slide-in-from-top-1">
                                <span className="mr-2">◈</span>
                                {recallProgress.phase === 'start' && 'Bắt đầu truy xuất ký ức...'}
                                {recallProgress.phase === 'stream' && 'Đang đồng bộ hóa dòng thời gian...'}
                                {recallProgress.phase === 'done' && 'Đã nạp xong ký ức liên quan.'}
                                {recallProgress.phase === 'error' && 'Kết nối linh thức thất bại.'}
                            </div>
                        )}

                        {attachedRecallPreview && (
                            <div className="space-y-1">
                                <button
                                    type="button"
                                    onClick={() => setShowAttachedRecall(!showAttachedRecall)}
                                    className="w-full flex items-center justify-between text-[10px] text-gray-400 hover:text-wuxia-gold transition-colors"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                            <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                            <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                        Chương trình đính kèm ({showAttachedRecall ? 'Thu gọn' : 'Xem chi tiết'})
                                    </span>
                                    <span>{showAttachedRecall ? '▲' : '▼'}</span>
                                </button>
                                {showAttachedRecall && (
                                    <div className="mt-2 text-[10px] text-gray-500 font-serif leading-relaxed bg-black/30 p-2 rounded border border-wuxia-gold/5 max-h-32 overflow-y-auto custom-scrollbar italic">
                                        {attachedRecallPreview}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ACTION SELECTION PANEL */}
            {!busy && (
                <div className="space-y-2 mb-1">
                    {/* AI-generated action options (primary choices) */}
                    {normalizedOptions.length > 0 && (
                        <div className="space-y-1.5 transition-all duration-300">
                            <div className="flex items-center gap-2 px-1">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-wuxia-gold/20 to-transparent"></div>
                                <button
                                    onClick={() => setShowActionOptions(!showActionOptions)}
                                    className="flex items-center gap-2 text-[9px] font-bold text-wuxia-gold/50 tracking-[0.2em] uppercase shrink-0 hover:text-wuxia-gold/80 transition-colors"
                                    title={showActionOptions ? "Thu gọn tùy chọn" : "Hiện tùy chọn"}
                                >
                                    <span>Tùy chọn hành động</span>
                                    <span className="text-[8px] opacity-60">{showActionOptions ? '▲' : '▼'}</span>
                                </button>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-wuxia-gold/20 to-transparent"></div>
                            </div>
                            
                             {showActionOptions && (
                                <div className="grid grid-cols-1 gap-1.5 animate-in slide-in-from-top-2 duration-300">
                                    {normalizedOptions.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionClick(opt)}
                                            disabled={loading}
                                            aria-label={`Lựa chọn ${idx + 1}: ${opt}`}
                                            className="group relative w-full text-left px-4 py-2.5 rounded-lg border border-wuxia-gold/15 bg-gradient-to-r from-wuxia-gold/[0.04] to-transparent hover:from-wuxia-gold/[0.12] hover:border-wuxia-gold/40 transition-all active:scale-[0.98] disabled:opacity-40 shrink-0"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span className="shrink-0 w-5 h-5 rounded-full border border-wuxia-gold/30 bg-wuxia-gold/10 flex items-center justify-center text-[10px] font-bold text-wuxia-gold/70 group-hover:bg-wuxia-gold/20 group-hover:text-wuxia-gold transition-colors">{idx + 1}</span>
                                                <span className="text-[12px] font-medium text-gray-300 group-hover:text-paper-white transition-colors leading-snug">{opt}</span>
                                            </div>
                                            <div className="absolute inset-y-0 left-0 w-0.5 bg-wuxia-gold/0 group-hover:bg-wuxia-gold/40 rounded-full transition-colors"></div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Default quick actions (horizontal scroll on mobile) */}
                    <div className={`grid grid-cols-3 gap-1.5 ${normalizedOptions.length > 0 ? 'pt-1' : ''}`}>
                        {[
                            { text: 'Tiếp tục diễn biến', icon: '▶', color: 'border-wuxia-gold/20 hover:border-wuxia-gold/50' },
                            { text: 'Chuyển cảnh nhanh', icon: '⟳', color: 'border-wuxia-cyan/20 hover:border-wuxia-cyan/50' },
                            { text: 'Hành động bất ngờ', icon: '✦', color: 'border-wuxia-red/20 hover:border-wuxia-red/50' }
                        ].map((btn, i) => (
                             <button
                                key={i}
                                onClick={() => handleQuickAction(btn.text)}
                                aria-label={btn.text}
                                 className={`relative w-full flex-1 rounded-lg border bg-black/30 overflow-hidden group transition-all active:scale-95 shrink-0 ${btn.color} ${normalizedOptions.length > 0 ? 'h-8' : 'h-10'}`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-1.5">
                                    <span className="text-[10px] opacity-50 group-hover:opacity-80 transition-opacity">{btn.icon}</span>
                                    <span className={`font-bold text-gray-400 group-hover:text-paper-white transition-colors ${normalizedOptions.length > 0 ? 'text-[10px]' : 'text-[11px]'}`}>{btn.text}</span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {showQuickRestartMenu && canQuickRestart && (
                <div className="rounded-lg border border-teal-400/30 /70 p-2 space-y-2">
                    <div className="text-xs text-teal-300 font-bold tracking-wider">Tùy chọn khởi động lại nhanh</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => { void handleQuickRestartSelect('world_only'); }}
                            disabled={busy}
                            className="text-xs px-3 py-2 rounded border border-gray-700 text-gray-200 hover:border-teal-300 hover:text-teal-200 disabled:opacity-40"
                        >
                            Chỉ tạo lại thế giới quan
                        </button>
                        <button
                            type="button"
                            onClick={() => { void handleQuickRestartSelect('opening_only'); }}
                            disabled={busy}
                            className="text-xs px-3 py-2 rounded border border-gray-700 text-gray-200 hover:border-teal-300 hover:text-teal-200 disabled:opacity-40"
                        >
                            Chỉ tạo lại cốt truyện mở đầu
                        </button>
                        <button
                            type="button"
                            onClick={() => { void handleQuickRestartSelect('all'); }}
                            disabled={busy}
                            className="text-xs px-3 py-2 rounded border border-gray-700 text-gray-200 hover:border-teal-300 hover:text-teal-200 disabled:opacity-40"
                        >
                            Thế giới quan + Cốt truyện mở đầu
                        </button>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setShowQuickRestartMenu(false)}
                            className="text-[11px] px-2 py-1 rounded border border-gray-700 text-gray-400 hover:text-gray-200"
                        >
                            Thu gọn
                        </button>
                    </div>
                </div>
            )}

            {/* Main Control Bar */}
            <div className="flex items-center gap-2">

                {/* Left Controls Group */}
                <div className="flex items-center gap-1 /40 border border-gray-700/50 rounded-xl p-1 h-12">
                    {/* Stream Toggle */}
                    <button
                        onClick={() => setIsStreaming(!isStreaming)}
                        className={`w-10 h-full rounded-lg flex items-center justify-center transition-all ${isStreaming ? 'text-wuxia-cyan bg-wuxia-cyan/10' : 'text-gray-600 hover:text-gray-400 opacity-50 cursor-not-allowed'}`}
                        title="Đã tắt phát trực tiếp (Tạm khóa)"
                        disabled={true}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                    </button>

                    <div className="w-px h-6 bg-gray-800"></div>

                    {/* Quick Restart */}
                    {canQuickRestart && (
                        <>
                            <button
                                onClick={() => setShowQuickRestartMenu(prev => !prev)}
                                disabled={busy}
                                className="w-10 h-full rounded-lg flex items-center justify-center text-teal-300 hover:text-teal-100 hover:bg-teal-900/20 transition-all disabled:opacity-30"
                                title="Khởi động lại nhanh"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
                                </svg>
                            </button>
                            <div className="w-px h-6 bg-gray-800"></div>
                        </>
                    )}

                    {/* Re-roll */}
                    <button
                        onClick={handleReroll}
                        disabled={busy || !canReroll}
                        className="w-10 h-full rounded-lg flex items-center justify-center text-gray-400 hover:text-wuxia-gold hover:bg-paper-white/5 transition-all disabled:opacity-30"
                        title={canReroll ? "Làm lại: Quay lại vòng trước và điền lại đầu vào." : "Không có vòng nào để làm lại"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                </div>

                {/* Input Field */}
                <div className={`flex-1 /40 border border-gray-700/50 rounded-xl h-12 flex items-center px-4 transition-all shadow-inner ${busy ? 'opacity-50 cursor-not-allowed' : 'focus-within:border-wuxia-gold/50 focus-within:/60'}`}>
                    <input
                        type="text"
                        className="w-full bg-transparent text-paper-white font-serif placeholder-gray-600 focus:outline-none"
                        placeholder={busy ? "Đang xử lý......" : "Nhập hành động của bạn..."}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !busy && handleSend()}
                        disabled={busy}
                    />
                </div>

                {/* Send / Stop Button */}
                {loading ? (
                    <button
                        onClick={handleStop}
                        className="w-14 h-12 bg-wuxia-red text-paper-white rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(163,24,24,0.3)] hover:bg-red-600 hover:scale-105 active:scale-95 transition-all"
                        title="Dừng tạo"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                ) : (
                    <button
                        onClick={() => { void handleSend(); }}
                        disabled={!content.trim() || busy}
                        className="w-14 h-12 bg-wuxia-gold text-ink-black rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(230,200,110,0.3)] hover:bg-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                        title="Gửi"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 01-12 0v-3" />
                        </svg>
                    </button>
                )}

            </div>

            {errorModal.open && (
                <div
                    className="fixed inset-0 z-[260] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
                    onClick={() => setErrorModal(prev => ({ ...prev, open: false }))}
                >
                    <div
                        className="w-full max-w-3xl rounded-lg border border-wuxia-gold/30 /90 p-5 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <h4 className="text-lg font-serif font-bold text-wuxia-gold">
                                {errorModal.title || 'Yêu cầu thất bại'}
                            </h4>
                             <button
                                 type="button"
                                 onClick={() => setErrorModal(prev => ({ ...prev, open: false }))}
                                 className="text-gray-400 hover:text-paper-white transition-all flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10"
                                 aria-label="Ẩn chi tiết lỗi"
                             >
                                 <IconGlyph name="close" className="w-4 h-4" />
                             </button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar rounded-md border border-gray-700/80 /60 p-3 text-xs text-gray-200 whitespace-pre-wrap">
                            {errorModal.content}
                        </div>
                        <div className="pt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setErrorModal(prev => ({ ...prev, open: false }))}
                                className="px-6 py-2 text-xs font-bold bg-wuxia-gold text-ink-black rounded hover:bg-white transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InputArea;
