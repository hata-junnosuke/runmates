import DeleteAccountForm from '@/features/account/components/DeleteAccountForm';

export default function DeleteAccountPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          アカウント削除
        </h1>
        <DeleteAccountForm />
      </div>
    </div>
  );
}
