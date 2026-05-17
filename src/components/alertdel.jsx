export default function AlertDelete({
  open,
  loading,
  closing = false,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300 ${
        closing ? "bg-black/0 opacity-0" : "bg-black/50 opacity-100"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-xl bg-white p-6 shadow-xl transition-all duration-300 ${
          closing
            ? "translate-y-3 scale-95 opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        }`}
      >
        <h2 className="text-xl font-semibold text-gray-900">Confirm delete</h2>
        <p className="mt-2 text-sm text-gray-600">
          จะลบบัญชีแต้ก๋า ลบแล้วลบเลยเน่อ
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
            onClick={onCancel}
            disabled={loading || closing}
          >
            ยกเลิก
          </button>
          <button
            type="button"
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
            onClick={onConfirm}
            disabled={loading || closing}
          >
            {loading ? "กำลังลบ..." : "ลบ"}
          </button>
        </div>
      </div>
    </div>
  );
}
