// export const _USER_ROLES = {
//     admin: "admin",
//     operations: "operations",
//     insurer_admin: "insurer_admin",
//     insurer_underwriter: "insurer_underwriter",
//     insurer_rm: "insurer_rm",
//     broker_admin: "broker_admin",
//     broker_rm: "broker_rm",
//     broker_creator: "broker_creator",
//     broker_approver: "broker_approver",
//     broker_creator_and_approver: "broker_creator_and_approver",
//     agent: "agent",
//     banca_admin: "banca_admin",
//     banca_rm: "banca_rm",
//     banca_creator: "banca_creator",
//     banca_approver: "banca_approver"
// };

export enum AllowedRoles {
    ADMIN = 'admin',
    OPERATIONS = 'operations',
    INSURER_ADMIN = 'insurer_admin',
    INSURER_UNDERWRITER = 'insurer_underwriter',
    INSURER_RM = 'insurer_rm',
    BROKER_ADMIN = 'broker_admin',
    BROKER_RM = 'broker_rm',
    BROKER_CREATOR = 'broker_creator',
    BROKER_APPROVER = 'broker_approver',
    BROKER_CREATOR_AND_APPROVER = "broker_creator_and_approver",

    AGENT_ADMIN = 'agent_admin',
    AGENT_CREATOR = 'agent_creator',
    AGENT_CREATOR_AND_APPROVER = 'agent_creator_and_approver',


    BANCA_ADMIN = 'banca_admin',
    BANCA_RM = 'banca_rm',
    BANCA_CREATOR = 'banca_creator',
    BANCA_APPROVER = 'banca_approver',
    BANCA_CREATOR_AND_APPROVER = "banca_creator_and_approver",

    SALES_CREATOR = 'sales_creator',
    SALES_APPROVER = 'sales_approver',
    SALES_CREATOR_AND_APPROVER = "sales_creator_and_approver",
    PLACEMENT_CREATOR = 'placement_creator',
    PLACEMENT_APPROVER = 'placement_approver',
    PLACEMENT_CREATOR_AND_APPROVER = "placement_creator_and_approver",


    

}

export interface IRole {
    _id?: string;
    name: AllowedRoles;
}
