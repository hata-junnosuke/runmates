import DeleteAccountForm from './_components/DeleteAccountForm';

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">アカウント削除</h1>
          <DeleteAccountForm />
        </div>
      </div>
    </div>
  );
}