interface UserProfileProps {
  params: Promise<{ id: string }>;
}

export default async function UserProfile({ params }: UserProfileProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">User Profile</h1>
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">User ID</h2>
          <p className="text-blue-600 font-mono text-sm break-all">{id}</p>
        </div>
        <p className="text-gray-600">
          This is a simple profile page displaying the user ID from the URL
          parameters.
        </p>
      </div>
    </div>
  );
}
