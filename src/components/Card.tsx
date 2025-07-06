
export  function Card({ title, description }: { title: string; description: string }) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg cursor-pointer transition-all">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </div>
    )
  }
  