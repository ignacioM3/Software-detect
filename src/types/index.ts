import z from "zod";

export const clientSchema = z.object({
    _id: z.string(),
    name: z.string(),
    number: z.string().optional(),
    address: z.string().optional(),
    email: z.string().optional(),
    minners: z.array(
        z.object({
            _id: z.string()
        })
    ).optional(),
});

export type Client = z.infer<typeof clientSchema>;
export type ClientCreateForm = Omit<Client, "_id" | "minners">;
export type ClientUpdateForm = Omit<Client, "minners">


export const minnerSchema = z.object({
    _id: z.string(),
    clientId: z.string(),
    name: z.string(),
    idModel: z.string(),
    reports: z.array(
        z.object({
            _id: z.string()
        })
    )
})

export type Minners = z.infer<typeof minnerSchema>;
export type MinerCreateForm = Omit<Minners, "clientId" | "_id" | "reports">
