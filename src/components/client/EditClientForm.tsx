import { useForm } from "react-hook-form";
import { Client, ClientUpdateForm } from "../../types";
import flashy from "@pablotheblink/flashyjs";
import useGlobal from "../../hooks/useGlobal";
import { FaSave } from "react-icons/fa";

interface EditClientFormProps {
    setEditingId: (id: string | null) => void;
    client: Client;
}


export function EditClientForm({ setEditingId, client }: EditClientFormProps) {
    const {setClients} = useGlobal()

    const initialValues = {
        _id: client._id,
        name: client.name || '',
        email: client.email || '',
        number: client.number || '',
        address: client.address || ''
    }


    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialValues
    })

    const handleEditClient = (formData: ClientUpdateForm) => {
        const updateClient = {
            ...formData,
            _id: client._id
        }
        window.electronAPI.updateClient(updateClient).then(res => {
            if (res.ok) {
                setEditingId(null);
                
                setClients(prevClients => {
                    return prevClients.map(c => c._id === client._id ? {...c, ...updateClient} : c)
                })
                flashy.success('Cliente actualizado correctamente')
            } else {
                flashy.error("Error al actualizar el cliente");
            }
        });
    }
    return (
        <tr className="bg-blue-50" >
            <td colSpan={6} className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre * {errors.name && <span className="text-red-500 font-bold uppercase ml-2">{errors.name.message}</span>}</label>
                        <input
                            type="text"
                            id="name"
                            {...register("name", {
                                required: "El nombre es obligatorio"
                            })}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            {...register("email", {
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Formato de correo inválido"
                                }
                            })}
                            placeholder="(sin datos)"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            type="tel"
                            id="number"
                            {...register("number")}
                            placeholder="(sin datos)"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <input
                            type="text"
                            id="address"
                            {...register("address")}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="(sin datos)"
                        />
                    </div>


                  
                </div>
                  <div className="flex items-end justify-end w-full mt-5">
                        <div className="flex gap-3">
                            <button
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit(handleEditClient)}
                                className="px-4 flex items-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                            >
                                 <FaSave />
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
            </td>
        </tr>
    )
}
