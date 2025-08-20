import DeleteAccountForm from '@/features/account/components/DeleteAccountForm';

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">
            アカウント削除
          </h1>
          <DeleteAccountForm />
        </div>
      </div>
    </div>
  );
}
