import { getRoles, createRole } from "./role.service";

let isInitializing = false;

export const initRolesLogic = async () => {
    if (isInitializing) return;
    isInitializing = true;

    try {
        const roles = await getRoles();
        if (roles instanceof Error) {
            console.error("Lỗi lấy danh sách roles:", roles);
            return;
        }

        const defaultRoles = ["admin", "staff", "customer"];

        for (const roleName of defaultRoles) {
            const exists = roles.find(r => r.name === roleName);
            if (!exists) {
                await createRole({ name: roleName });
            }
        }
    } catch (error) {
        console.error("Error initializing roles:", error);
    }
};
