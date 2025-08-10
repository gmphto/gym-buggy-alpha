export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">Welcome to Gym Buddy</h1>
      <p className="mt-4">
        Visit the <a href="/map" className="text-blue-600 underline">map</a> to draw features.
      </p>
    </main>
  )
}
