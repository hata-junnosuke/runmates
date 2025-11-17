import CreateAccountForm from '@/features/auth/components/forms/CreateAccountForm';

export default function CreateAccountPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 to-blue-200 px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg md:p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-green-700 md:text-3xl">
          アカウント作成
        </h2>
        <CreateAccountForm />
      </div>
    </div>
  );
}
