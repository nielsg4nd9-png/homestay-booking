import Link from 'next/link'

export default function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-emerald-600">✓</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800">จองสำเร็จ</h1>
        <p className="text-gray-600 mt-2">
          เราได้บันทึกคำจองของคุณแล้ว จะติดต่อยืนยันผ่านอีเมล
        </p>
        {searchParams.id && (
          <p className="text-sm text-gray-500 mt-2">รหัสการจอง: {searchParams.id}</p>
        )}
        <Link
          href="/"
          className="mt-6 inline-block py-2.5 px-5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  )
}
