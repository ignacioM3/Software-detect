import { useForm } from "react-hook-form";
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaPlus, FaUser } from "react-icons/fa";
import { ClientCreateForm } from "../../types";
import flashy from "@pablotheblink/flashyjs";
import useGlobal from "../../hooks/useGlobal";


export function AddClientForm({setIsAdding}: {setIsAdding: (isAdding: boolean) => void}) {
    const {setClients} = useGlobal()
    const initialValues = {
        name: "",
        email: "",
        number: "",
        address: ""
    }

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: initialValues
    })
    const handleCreateClient =async (formData: ClientCreateForm) => {
        const newClient = {
            ...formData,
            minners: [],
            _id: crypto.randomUUID()
        }
        const res = await window.electronAPI.saveClients(newClient);
        if(res.ok){
            reset(initialValues)
            flashy.success("Cliente agregado correctamente")
            setClients(prevClient => [...prevClient, newClient])
            setIsAdding(false)
        }else{
            flashy.error("Error al agregar el cliente");
        }
   
    }
    return (
        <form 
            className="border-b border-gray-200 p-6 bg-blue-50"
            onSubmit={handleSubmit(handleCreateClient)}
            >
            <h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center gap-2">
                <FaPlus className="text-blue-700" />
                Agregar Nuevo Cliente
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo * {errors.name && <span className="text-red-500 font-bold uppercase ml-2">{errors.name.message}</span>}</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                            <FaUser />
                        </span>
                        <input
                            type="text"
                            id="name"
                            {...register("name", {required: "El nombre es obligatorio"})}
                            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: Carlos Martínez"
                        />
                    </div>
                </div>



                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico {errors.email && <span className="text-red-500 font-bold uppercase ml-2">{errors.email.message}</span>}</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                            <FaEnvelope />
                        </span>
                        <input
                            type="email"
                            id="email"
                            {...register("email", {
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Formato de correo inválido"
                                }
                            })}
                            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="ejemplo@empresa.cl"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                            <FaPhone />
                        </span>
                        <input
                            type="tel"
                            name="phone"

                            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+56 9 1234 5678"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                            <FaMapMarkerAlt />
                        </span>
                        <input
                            type="text"
                            name="address"

                            className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: Av. Siempre Viva 123, Ciudad"
                        />
                    </div>
                </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer"

                >
                    <FaPlus />
                    Agregar Cliente
                </button>
            </div>
        </form>
    )
}
