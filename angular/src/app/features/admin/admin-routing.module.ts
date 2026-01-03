import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DashboardDemoComponent } from '../view/dashboarddemo.component';
import { MyOrganizationComponent } from './my-organization/my-organization.component';

export const SUPER_ADMIN_MENU_ONBOARDING: MenuItem[] = [
    {
        label: "Onboarding",
        icon: "pi pi-fw pi-book",
        items: [
            {
                label: "Users",
                icon: "pi pi-fw pi-users",
                routerLink: ["/backend/admin/users"]
            },
            {
                label: "Partners",
                icon: "pi pi-fw pi-users",
                routerLink: ["/backend/admin/partners"]
            },
            {
                label: "Roles",
                icon: "pi pi-fw pi-users",
                routerLink: ["/backend/admin/roles"]
            },
            // {
            //     label: "Product Partners Configuration",
            //     icon: "pi pi-fw pi-cog",
            //     routerLink: ["/backend/admin/bsc-product-partner-configuration"]
            // },
        ]
    },
];

export const ADMIN_MENU_ONBOARDING: MenuItem[] = [
    {
        label: "User Maintenance",
        icon: "pi pi-fw pi-book",
        items: [
            {
                label: "Users",
                icon: "pi pi-fw pi-users",
                routerLink: ["/backend/admin/users"]
            },
        ],
    },
];
//Intergation-EB [Start]
// export const ADMIN_MENU_GMC: MenuItem[] = [
//     {
//         label: "GMC Master",
//         icon: "pi pi-fw pi-book",
//         items: [
//             {
//                 label: "Add Masters",
//                 icon: "pi pi-fw pi-users",
//                 routerLink: ["/backend/admin/gmcmaster"]
//             },
//             {
//                 label: "Annual Turnover",
//                 icon: "pi pi-fw pi-chart-bar",
//                 routerLink: ["/backend/admin/annualturnover"]
//             },
//             {
//                 label: "Coverage Type",
//                 icon: "pi pi-fw pi-chart-bar",
//                 routerLink: ["/backend/admin/coveragetypes"]
//             },
//             {
//                 label: "Employees Count Master",
//                 icon: "pi pi-fw pi-users",
//                 routerLink: ["/backend/admin/employeesCounts"]
//             },
//             {
//                 label: "TPA Master",
//                 icon: "pi pi-fw pi-users",
//                 routerLink: ["/backend/admin/thirdPartyAdministrators"]
//             },
//             {
//                 label: "GMC Tab Master",
//                 icon: "pi pi-fw pi-users",
//                 routerLink: ["/backend/admin/gmctabmaster"]
//             },
//             {
//                 label: "Lead Insurers Master",
//                 icon: "pi pi-fw pi-users",
//                 routerLink: ["/backend/admin/leadInsurers"]
//             },
//             {
//                 label: "Product Wise Age Master",
//                 icon: "pi pi-fw pi-list",
//                 routerLink: ["/backend/admin/productWiseAge"]
//             },
//             {
//                 label: "Employees Rate Master",
//                 icon: "pi pi-fw pi-users",
//                 routerLink: ["/backend/admin/emprates"]
//             },
//             {
//                 label: "Sum Insured",
//                 icon: "pi pi-fw pi-chart-bar",
//                 routerLink: ["/backend/admin/suminsured"]
//             },
//             {
//                 label: "File Template",
//                 icon: "pi pi-fw pi-chart-bar",
//                 routerLink: ["/backend/admin/gmcfiletemplate"]
//             },
//         ]
//     }
// ];

// export const ADMIN_MENU_CLIENT_GMC: MenuItem[] = [
//     {
//         label: "GMC Master",
//         icon: "pi pi-fw pi-book",
//         items: [
//             {
//                 label: "Add Masters",
//                 icon: "pi pi-fw pi-users",
//                 routerLink: ["/backend/admin/gmcmaster"]
//             },
//             {
//                 label: "File Template",
//                 icon: "pi pi-fw pi-chart-bar",
//                 routerLink: ["/backend/admin/suminsured"]
//             },
//         ]
//     }
// ];


// export const ADMIN_MENU_LIABILITY: MenuItem[] = [
//     {
//         label: "Liability LOVs",
//         icon: "pi pi-fw pi-book",
//         items: [
//             {
//                 label: "Liability Dropdowns",
//                 icon: "pi pi-fw pi-chart-bar",
//                 routerLink: ["/backend/admin/list-of-value-master/wc-dropdown-list"]
//             },
//             {
//                 label: "Addon Cover Options",
//                 icon: "pi pi-fw pi-envelope",
//                 routerLink: ["/backend/admin/add-ons-covers-ddl-options"]
//             }
//         ]
//     }
// ];


//Intergation-EB [End]
export const ADMIN_MENU_CLIENTS: MenuItem[] = [
    {
        label: "Clients",
        icon: "pi pi-fw pi-id-card",
        items: [
            {
                label: "Clients",
                icon: "pi pi-fw pi-user",
                routerLink: ["/backend/admin/clients"]
            },
            // {
            //     label: "Client Locations",
            //     icon: "pi pi-fw pi-user",
            //     routerLink: ["/backend/admin/client-locations"]
            // },
            {
                label: "Client Groups",
                icon: "pi pi-fw pi-users",
                routerLink: ["/backend/admin/client-groups"]
            },
            {
                label: "Client KYCs",
                icon: "pi pi-fw pi-shield",
                routerLink: ["/backend/admin/client-kyc-masters"]
            }
        ]
    },
]
export const ADMIN_MENU_CLIENTS_KYC: MenuItem[] = [
    {
        label: "Clients",
        icon: "pi pi-fw pi-id-card",
        items: [
            {
                label: "Client KYCs",
                icon: "pi pi-fw pi-shield",
                routerLink: ["/backend/admin/client-kyc-masters"]
            }
        ]
    },
]
export const ADMIN_MENU_CLIENTS_CONFIGURATIONS: MenuItem[] = [
    {
        label: "Clients",
        icon: "pi pi-fw pi-id-card",
        items: [
            {
                label: "Clients",
                icon: "pi pi-fw pi-user",
                routerLink: ["/backend/admin/clients"]
            },
            // {
            //     label: "Client Locations",
            //     icon: "pi pi-fw pi-user",
            //     routerLink: ["/backend/admin/client-locations"]
            // },
            {
                label: "Client Groups",
                icon: "pi pi-fw pi-users",
                routerLink: ["/backend/admin/client-groups"]
            },

        ]
    },
]

export const ADMIN_MENU_QUOTE: MenuItem[] = [
    {
        label: "Quote",
        icon: "pi pi-fw pi-chart-pie",
        routerLink: ["/backend/admin/quote"]
    },
];

export const ADMIN_MENU_MASTERS_TENANTAWARE: MenuItem[] = [
    {
        label: "Property Master",
        icon: "pi pi-fw pi-server",
        items: [
            {
                label: "Sequence",
                icon: "pi pi-fw pi-list",
                routerLink: ["/backend/admin/sequence"]
            },
            // {
            //     label: "Industry Types",
            //     icon: "pi pi-fw pi-building",
            //     routerLink: ["/backend/admin/industry-types"]
            // },
            {
                label: "Rates",
                icon: "pi pi-fw pi-percentage",
                items: [
                    {
                        label: "Earthquake Rates",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/earthquake-rates"]
                    },
                    {
                        label: "Occupancy Rates",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/occupancy-rates"]
                    },
                    {
                        label : " Sub-Occupancy",
                        icon : "pi pi-fw pi-database",
                        routerLink : ["/backend/admin/sub-occupancy"]
                    },
                    {
                        label: "Terrorism Rates",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/terrorism-rates"]
                    }
                ]
            },
            {
                label: "List of Value Master",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/list-of-value-master"]
            },
            {
                label: "Addon Covers",
                icon: "pi pi-fw pi-envelope",
                routerLink: ["/backend/admin/addon-covers"]
            },
            {
                label: "Quote Location Breakup",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/quote-location-breakup-master"]
            },
            {
                label: "Under Writer",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/under-writer"]
            },
            // {
            //     label: "Bharat Suraksha",
            //     icon: "pi pi-fw pi-chart-bar",
            //     items: [
            //         {
            //             label: "Discounts",
            //             icon: "pi pi-fw pi-database",
            //             routerLink: ["/backend/admin/bsc-discount"]
            //         },
            //         {
            //             label: "Burglary",
            //             icon: "pi pi-fw pi-database",
            //             routerLink: ["/backend/admin/bsc-burglary-and-housebreakings"]
            //         },
            //         {
            //             label: "Electronic Equipment",
            //             icon: "pi pi-fw pi-database",
            //             routerLink: ["/backend/admin/bsc-electronic-equipments"]
            //         },
            //         {
            //             label: "Fire Loss Of Profit",
            //             icon: "pi pi-fw pi-database",
            //             routerLink: ["/backend/admin/bsc-fire-loss-of-profits"]
            //         },
            //         {
            //             label: "Money Safe Till",
            //             icon: "pi pi-fw pi-database",
            //             routerLink: ["/backend/admin/bsc-money-safe-till-cover"]
            //         },
            //         {
            //             label: "Money Transit",
            //             icon: "pi pi-fw pi-database",
            //             routerLink: ["/backend/admin/bsc-money-transits"]
            //         },
            //         {
            //             label: "Signage",
            //             icon: "pi pi-fw pi-database",
            //             routerLink: ["/backend/admin/bsc-signage-cover"]
            //         },
            //         {
            //             label: "Liability",
            //             icon: "pi pi-fw pi-database",
            //             routerLink: ["/backend/admin/bsc-liability-section-cover"]
            //         },
            //         {
            //             label: "Fidelity Guarantee",
            //             icon: "pi pi-fw pi-database",
            //             routerLink: ["/backend/admin/bsc-fidelity-guarantee-cover"]
            //         },
            //         {
            //             label: "Fixed Plate Glass",
            //             icon: "pi pi-fw pi-database",
            //             routerLink: ["/backend/admin/bsc-fixed-plate-glass-cover"]
            //         },
            //         {
            //             label: "Accompanied Baggage",
            //             icon: "pi pi-fw pi-database",
            //             routerLink: ["/backend/admin/bsc-accompanied-baggage-cover"]
            //         },
            //         {
            //             label: "Portable Equipment",
            //             icon: "pi pi-fw pi-database",
            //             routerLink: ["/backend/admin/bsc-portable-equipments-cover"]
            //         }
            //     ]
            // },
            {
                label: "BSC Covers",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/bsc-covers"]
            },
            {
                label: "Claim Experience",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/claim-experience"]
            },
            {
                label: "exclusion",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/exclusion"]
            },
            {
                label: "subjectivity",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/subjectivity"]
            },
            {
                label: "warranty",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/warranty"]
            },
            {
                label: "Risk Management Feature",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/risk-management-features"]
            },
            {
                label: "Product Category Master",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/category-product-master-features"]
            },
            {
                label: "ICRM Contact",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/icrm-contact"]
            },

        ]
    }
];
export const ADMIN_MENU_MASTERS_CONFIGURATIONS: MenuItem[] = [
    {
        label: "Property Master",
        icon: "pi pi-fw pi-server",
        items: [
            // {
            //     label: "Industry Types",
            //     icon: "pi pi-fw pi-building",
            //     routerLink: ["/backend/admin/industry-types"]
            // },
            {
                label: "Rates",
                icon: "pi pi-fw pi-percentage",
                items: [
                    {
                        label: "Earthquake Rates",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/earthquake-rates"]
                    },
                    {
                        label: "Occupancy Rates",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/occupancy-rates"]
                    },
                    {
                        label : " Sub-Occupancy",
                        icon : "pi pi-fw pi-database",
                        routerLink : ["/backend/admin/sub-occupancy"]
                    },
                    {
                        label: "Terrorism Rates",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/terrorism-rates"]
                    }
                ]
            },
            {
                label: "List of Value Master",
                icon: "pi pi-fw pi-chart-bar",
                items: [
                    // {
                    //     label: "List of Value Master",
                    //     icon: "pi pi-fw pi-chart-bar",
                    //     routerLink: ["/backend/admin/list-of-value-master"]
                    // },
                    {
                        label: "SI Split",
                        icon: "pi pi-fw pi-chart-bar",
                        routerLink: ["/backend/admin/list-of-value-master/si-split-list"]
                    },
                    {
                        label: "BSC Dropdowns",
                        icon: "pi pi-fw pi-chart-bar",
                        routerLink: ["/backend/admin/list-of-value-master/dropdown-list"]
                    },
                    {
                        label: "Risk Paramters",
                        icon: "pi pi-fw pi-chart-bar",
                        routerLink: ["/backend/admin/list-of-value-master/risk-parameter-list"]
                    },
                    // {
                    //     label: "WC Dropdowns",
                    //     icon: "pi pi-fw pi-chart-bar",
                    //     routerLink: ["/backend/admin/list-of-value-master/wc-dropdown-list"]
                    // }
                ]
            },
            {
                label: "Risk Inspection Master",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/risk-inspection-master"]
            },
            {
                label: "Location",
                icon: "pi pi-fw pi-globe",
                items: [
                    {
                        label: "Countries",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/countries"]
                    },
                    {
                        label: "States",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/states"]
                    },
                    {
                        label: "Cities",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/cities"]
                    },
                    {
                        label: "Districts",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/districts"]
                    },
                    {
                        label: "Pincodes",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/pincodes"]
                    }
                ]
            },
            {
                label: "Sectors",
                icon: "pi pi-fw pi-envelope",
                routerLink: ["/backend/admin/sectors"]
            },

            {
                label: "Hazard Categories",
                icon: "pi pi-fw pi-exclamation-triangle",
                routerLink: ["/backend/admin/hazard-categories"]
            },
            {
                label: "Addon Covers",
                icon: "pi pi-fw pi-envelope",
                routerLink: ["/backend/admin/addon-covers"]
            },
            {
                label: "BSC Covers",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/bsc-covers"]
            },
            {
                label: "Risk Management Feature",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/risk-management-features"]
            },
            {
                label: "Product Category Master",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/category-product-master-features"]
            },
            {
                label: "Branch Master",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/branch-master"]
            },
            {
                label: "Policy Period",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/policy-period"]
            },
        ]
    }
];

export const ADMIN_MENU_MASTERS_DATA: MenuItem[] = [
    {
        label: "Property Master",
        icon: "pi pi-fw pi-server",
        items: [

            {
                label: "Rates",
                icon: "pi pi-fw pi-percentage",
                items: [
                    {
                        label: "Earthquake Rates",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/earthquake-rates"]
                    },
                    {
                        label: "Occupancy Rates",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/occupancy-rates"]
                    },
                    {
                        label : " Sub-Occupancy",
                        icon : "pi pi-fw pi-database",
                        routerLink : ["/backend/admin/sub-occupancy"]
                    },
                    {
                        label: "Terrorism Rates",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/terrorism-rates"]
                    }
                ]
            },
            {
                label: "List of Value Master",
                icon: "pi pi-fw pi-chart-bar",
                items: [
                    // {
                    //     label: "List of Value Master",
                    //     icon: "pi pi-fw pi-chart-bar",
                    //     routerLink: ["/backend/admin/list-of-value-master"]
                    // },
                    {
                        label: "SI Split",
                        icon: "pi pi-fw pi-chart-bar",
                        routerLink: ["/backend/admin/list-of-value-master/si-split-list"]
                    },
                    {
                        label: "BSC Dropdowns",
                        icon: "pi pi-fw pi-chart-bar",
                        routerLink: ["/backend/admin/list-of-value-master/dropdown-list"]
                    },
                    {
                        label: "Risk Paramters",
                        icon: "pi pi-fw pi-chart-bar",
                        routerLink: ["/backend/admin/list-of-value-master/risk-parameter-list"]
                    },
                    // {
                    //     label: "WC Dropdowns",
                    //     icon: "pi pi-fw pi-chart-bar",
                    //     routerLink: ["/backend/admin/list-of-value-master/wc-dropdown-list"]
                    // },
                ]
            },
            {
                label: "Addon Covers",
                icon: "pi pi-fw pi-envelope",
                routerLink: ["/backend/admin/addon-covers"]
            },
            {
                label: "Under Writer",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/under-writer"]
            },

            {
                label: "BSC Covers",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/bsc-covers"]
            },
            {
                label: "exclusion",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/exclusion"]
            },
            {
                label: "subjectivity",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/subjectivity"]
            },
            {
                label: "warranty",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/warranty"]
            },
            {
                label: "Branch Master",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/branch-master"]
            },
        ]
    }
];
export const ADMIN_MENU_MASTERS_TENANTAWARE_ICRM: MenuItem[] = [
    {
        label: "Property Master",
        icon: "pi pi-fw pi-server",
        items: [

            {
                label: "ICRM Contact",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/icrm-contact"]
            },
            {
                label: "Branch Master",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/branch-master"]
            },


        ]
    }
];

export const ADMIN_MENU_CONFIGURATIONS: MenuItem[] = [
    {
        label: "Configuration (SYSTEM)",
        icon: "pi pi-fw pi-server",
        items: [
            {
                label: "Products",
                icon: "pi pi-fw pi-box",
                routerLink: ["/backend/admin/products"]
            },
            // {
            //     label: "Product Partner",
            //     icon: "pi pi-fw pi-chart-bar",
            //     routerLink: ["/backend/admin/product-partner-configuration"]
            // },
            // {
            //     label: "BSC Product Partner ",
            //     icon: "pi pi-fw pi-chart-bar",
            //     routerLink: ["/backend/admin/bsc-product-partner-configuration"]
            // },
            {
                label: "Product Partner Ic (OTC)",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/product-partner-ic-configuration"]
            },
            {
                label: "Email Configuration",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/email-configuration"]
            },
            {
                label: "Email History",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/email-history"]
            },{
                label: "Login History",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/login-history"]
            },{
                label : "Transaction History",
                icon : "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/transaction-history"]
            },{
                label : "Merchant",
                icon: "pi pi-fw pi-box",
                routerLink: ["/backend/admin/merchant"]
            },
            {
                label: "API Template",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/api-template"]
            },
            {
                label: "API History",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/api-history"]
            },
            {
                label: "Co-Insurers Master",
                icon: "pi pi-fw pi-users",
                routerLink: ["/backend/admin/Co-Insurers"]
            },
            {
                label: "Payment Details",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/payments"]
            },
            // {
            //     label: "Rm Mapped Intermediate",
            //     icon: "pi pi-fw pi-chart-bar",
            //     routerLink: ["/backend/admin/rm-mapped-intermediate"]
            // },
            {
                label: "Bsc Clause",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/dynamic-clauses"]
            },
            {
                label: "Terms and Conditions",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/terms-conditions"]
            },
            {
                label: "BSC Covers Description",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/bsc-covers-description"]
            },
            {
                label: "Broker Module Mapping",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/broker-module-mapping"]
            },
        ]
    }
]
export const ADMIN_MENU_CONFIGURATION: MenuItem[] = [
    {
        label: "Configuration (SYSTEMS)",
        icon: "pi pi-fw pi-server",
        items: [
            {
                label: "Product Partner Ic (OTC)",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/product-partner-ic-configuration"]
            },
            {
                label: "API History",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/api-history"]
            },
            {
                label: "Rm Mapped Intermediate",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/rm-mapped-intermediate"]
            },
            {
                label: "Bsc Clause",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/dynamic-clauses"]
            },
            {
                label: "Terms and Conditions",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/terms-conditions"]
            },
            {
                label: "BSC Covers Description",
                icon: "pi pi-fw pi-chart-bar",
                routerLink: ["/backend/admin/bsc-covers-description"]
            },
        ]
    }
]

export const ADMIN_MENU_Technical: MenuItem[] = [
    {
        label: "Technical",
        icon: "pi pi-fw pi-book",
        items: [
            {
                label: "Task",
                icon: "pi pi-fw pi-list",
                routerLink: ["/backend/admin/tasks"]
            },
            {
                label: "Task Queue",
                icon: "pi pi-fw pi-database",
                routerLink: ["/backend/admin/task-queue"]
            }
        ]
    }
];
/* export const ADMIN_MENU_MASTERS_SYSTEM: MenuItem[] = [
    {
        label: "Master Data (SYSTEM)",
        icon: "pi pi-fw pi-server",
        items: [
            {
                label: "Location",
                icon: "pi pi-fw pi-globe",
                items: [
                    {
                        label: "Countries",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/countries"]
                    },
                    {
                        label: "States",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/states"]
                    },
                    {
                        label: "Cities",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/cities"]
                    },
                    {
                        label: "Districts",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/districts"]
                    },
                    {
                        label: "Pincodes",
                        icon: "pi pi-fw pi-database",
                        routerLink: ["/backend/admin/pincodes"]
                    }
                ]
            },
            {
                label: "Sectors",
                icon: "pi pi-fw pi-envelope",
                routerLink: ["/backend/admin/sectors"]
            },

            {
                label: "Hazard Categories",
                icon: "pi pi-fw pi-exclamation-triangle",
                routerLink: ["/backend/admin/hazard-categories"]
            },
            // {
            //     label: "Covers",
            //     icon: "pi pi-fw pi-globe",
            //     items: [
            //         {
            //             label: "Declaration Policy Cover",
            //             icon: "pi pi-fw pi-exclamation-triangle",
            //             routerLink: ["/backend/admin/declaration-policy-cover"]
            //         },
            //         {
            //             label: "Floater Cover Addon",
            //             icon: "pi pi-fw pi-exclamation-triangle",
            //             routerLink: ["/backend/admin/floater-cover-addon"]
            //         },
            //         {
            //             label: "Loss of Rent Cover",
            //             icon: "pi pi-fw pi-exclamation-triangle",
            //             routerLink: ["/backend/admin/loss-of-rent-cover"]
            //         },
            //         {
            //             label: "Rent for Alternative Accomodation Cover",
            //             icon: "pi pi-fw pi-exclamation-triangle",
            //             routerLink: ["/backend/admin/rent-for-alternative-accomodation-cover"]
            //         },
            //         {
            //             label: "Personal Accident Cover",
            //             icon: "pi pi-fw pi-exclamation-triangle",
            //             routerLink: ["/backend/admin/personal-accident-cover"]
            //         },
            //         {
            //             label: "Valuable Content on Agreed Value Basis Cover",
            //             icon: "pi pi-fw pi-exclamation-triangle",
            //             routerLink: ["/backend/admin/valuable-content-on-agreed-value-basis-cover"]
            //         },
            //     ]

            // },








        ]
    }
    // {
    //   label: "Misc",
    //   icon: "pi pi-fw pi-star",
    //   routerLink: ["/backend"],
    //   items: [
    //     {
    //       label: "Form Layout",
    //       icon: "pi pi-fw pi-id-card",
    //       routerLink: ["/backend/admin/formlayout"]
    //     },
    //     {
    //       label: "Table",
    //       icon: "pi pi-fw pi-table",
    //       routerLink: ["/backend/admin/table"]
    //     },
    //     {
    //       label: "Menu",
    //       icon: "pi pi-fw pi-bars",
    //       routerLink: ["/backend/admin/menu"],
    //       preventExact: true
    //     },
    //     {
    //       label: "Errors",
    //       icon: "pi pi-fw pi-table",
    //       routerLink: ["/backend/admin/test-error"]
    //     }
    //   ]
    // },
    // {
    //   label: "Pages",
    //   icon: "pi pi-fw pi-briefcase",
    //   routerLink: ["/backend/admin/pages"],
    //   items: [
    //     {
    //       label: "Crud",
    //       icon: "pi pi-fw pi-pencil",
    //       routerLink: ["/backend/admin/pages/crud"]
    //     },
    //     {
    //       label: "Login",
    //       icon: "pi pi-fw pi-sign-in",
    //       routerLink: ["/login"]
    //     },
    //     {
    //       label: "Error",
    //       icon: "pi pi-fw pi-times-circle",
    //       routerLink: ["/server-error"]
    //     },
    //     {
    //       label: "Not Found",
    //       icon: "pi pi-fw pi-exclamation-circle",
    //       routerLink: ["/not-found"]
    //     },
    //     {
    //       label: "Access Denied",
    //       icon: "pi pi-fw pi-lock",
    //       routerLink: ["/access-denied"]
    //     },
    //     {
    //       label: "Empty",
    //       icon: "pi pi-fw pi-circle-off",
    //       routerLink: ["/backend/admin/pages/empty"]
    //     }
    //   ]
    // }

    // {
    //   label: "Partner Management",
    //   icon: "pi pi-fw pi-star",
    //   routerLink: ["/backend"],
    //   items: [
    //     {
    //       label: "Addon Cover Sectors",
    //       icon: "pi pi-fw pi-id-card",
    //       routerLink: ["/backend/admin/addon-cover-sectors"]
    //     },
    //     {
    //       label: "Quote Location Addon",
    //       icon: "pi pi-fw pi-id-card",
    //       routerLink: ["/backend/admin/quote-location-addon"]
    //     },
    //     {
    //       label: "Quote Location Occupancy",
    //       icon: "pi pi-fw pi-id-card",
    //       routerLink: ["/backend/admin/quote-location-occupancy"]
    //     },
    //   ]
    // },
    // {
    //   label: "Misc",
    //   icon: "pi pi-fw pi-star",
    //   routerLink: ["/backend"],
    //   items: [
    //     {
    //       label: "Form Layout",
    //       icon: "pi pi-fw pi-id-card",
    //       routerLink: ["/backend/admin/formlayout"]
    //     },
    //     {
    //       label: "Table",
    //       icon: "pi pi-fw pi-table",
    //       routerLink: ["/backend/admin/table"]
    //     },
    //     {
    //       label: "Menu",
    //       icon: "pi pi-fw pi-bars",
    //       routerLink: ["/backend/admin/menu"],
    //       preventExact: true
    //     },
    //     {
    //       label: "Errors",
    //       icon: "pi pi-fw pi-table",
    //       routerLink: ["/backend/admin/test-error"]
    //     }
    //   ]
    // },
    // {
    //   label: "Pages",
    //   icon: "pi pi-fw pi-briefcase",
    //   routerLink: ["/backend/admin/pages"],
    //   items: [
    //     {
    //       label: "Crud",
    //       icon: "pi pi-fw pi-pencil",
    //       routerLink: ["/backend/admin/pages/crud"]
    //     },
    //     {
    //       label: "Login",
    //       icon: "pi pi-fw pi-sign-in",
    //       routerLink: ["/login"]
    //     },
    //     {
    //       label: "Error",
    //       icon: "pi pi-fw pi-times-circle",
    //       routerLink: ["/server-error"]
    //     },
    //     {
    //       label: "Not Found",
    //       icon: "pi pi-fw pi-exclamation-circle",
    //       routerLink: ["/not-found"]
    //     },
    //     {
    //       label: "Access Denied",
    //       icon: "pi pi-fw pi-lock",
    //       routerLink: ["/access-denied"]
    //     },
    //     {
    //       label: "Empty",
    //       icon: "pi pi-fw pi-circle-off",
    //       routerLink: ["/backend/admin/pages/empty"]
    //     }
    //   ]
    // }
]; */

const routes: Routes = [
    { path: "", component: DashboardDemoComponent },

    // {
    //     path: "my-organization", component: MyOrganizationComponent


    {
        path: "users",
        loadChildren: () => import("./user/user.module").then(mod => mod.UserModule)
    },
    {
        path: "partners",
        loadChildren: () => import("./partner/partner.module").then(mod => mod.PartnerModule)
    },
    {
        path: "clients",
        loadChildren: () => import("./client/client.module").then(mod => mod.ClientModule)
    },
    {
        path: "client-groups",
        loadChildren: () => import("./client-group/client-group.module").then(mod => mod.ClientGroupModule)
    },
    {
        path: "client-kyc-masters",
        loadChildren: () => import("./client-kyc/client-kyc.module").then(mod => mod.ClientKycModule)
    },
    {
        path: "client-locations",
        loadChildren: () => import("./client-location/client-location.module").then(mod => mod.ClientLocationModule)
    },
    {
        path: "quote",
        loadChildren: () => import("./quote/quote.module").then(mod => mod.QuoteModule)
    },
    {
        path: "payments",
        loadChildren: () => import("./payment-details/payment-details.module").then(mod => mod.PaymentDetailsModule)
    },
    {
        path: "countries",
        loadChildren: () => import("./country/country.module").then(mod => mod.CountryModule)
    },
    {
        path: "states",
        loadChildren: () => import("./state/state.module").then(mod => mod.StateModule)
    },
    {
        path: "cities",
        loadChildren: () => import("./city/city.module").then(mod => mod.CityModule)
    },
    {
        path: "districts",
        loadChildren: () => import("./district/district.module").then(mod => mod.DistrictModule)
    },
    {
        path: "pincodes",
        loadChildren: () => import("./pincode/pincode.module").then(mod => mod.PincodeModule)
    },
    {
        path: "sectors",
        loadChildren: () => import("./sector/sector.module").then(mod => mod.SectorModule)
    },
    {
        path: "roles",
        loadChildren: () => import("./role/role.module").then(mod => mod.RoleModule)
    },
    {
        path: "sequence",
        loadChildren: () => import("./sequence/sequence.module").then(mod => mod.SequenceModule)
    },
    {
        path: "addon-covers",
        loadChildren: () => import("./addon-cover/addon-cover.module").then(mod => mod.AddonCoverModule)
    },
    {
        path: "earthquake-rates",
        loadChildren: () => import("./earthquake-rate/earthquake-rate.module").then(mod => mod.EarthquakeRateModule)
    },
    {
        path: "occupancy-rates",
        loadChildren: () => import("./occupancy-rate/occupancy-rate.module").then(mod => mod.OccupancyRateModule)
    },
    {
        path: "sub-occupancy",
        loadChildren: () => import("./sub-occupancy/sub-occupancy.module").then(mod => mod.SubOccupancyModule)
    },
    {
        path: "terrorism-rates",
        loadChildren: () => import("./terrorism-rate/terrorism-rate.module").then(mod => mod.TerrorismRateModule)
    },
    {
        path: "industry-types",
        loadChildren: () => import("./industry-type/industry-type.module").then(mod => mod.IndustryTypeModule)
    },
    {
        path: "products",
        loadChildren: () => import("./product/product.module").then(mod => mod.ProductModule)
    },
    {
        path: "hazard-categories",
        loadChildren: () => import("./hazard-category/hazard-category.module").then(mod => mod.HazardCategoryModule)
    },
    {
        path: "bsc-covers",
        loadChildren: () => import(".//bsc-cover/bsc-cover.module").then(mod => mod.BscCoverModule)
    },
    {
        path: "policy-period",
        loadChildren: () => import(".//policy-period/policy-period.module").then(mod => mod.PolicyPeriodModule)
    },
    {
        path: "bsc-discount",
        loadChildren: () => import("./bsc-discount/bsc-discount.module").then(mod => mod.BscDiscountModule)
    },
    {
        path: "bsc-burglary-and-housebreakings",
        loadChildren: () => import("./bsc-burglary-and-housebreaking/bsc-burglary-and-housebreaking.module").then(mod => mod.BscBurglaryAndHousebreakingModule)
    },
    {
        path: "bsc-electronic-equipments",
        loadChildren: () => import("./bsc-electronic-equipment/bsc-electronic-equipment.module").then(mod => mod.BscElectronicEquipmentModule)
    },
    {
        path: "bsc-fire-loss-of-profits",
        loadChildren: () => import("./bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.module").then(mod => mod.BscFireLossOfProfitModule)
    },
    {
        path: "bsc-money-safe-till-cover",
        loadChildren: () => import("./bsc-money-safe-till/bsc-money-safe-till.module").then(mod => mod.BscMoneySafeTillModule)
    },
    {
        path: "bsc-money-transits",
        loadChildren: () => import("./bsc-money-transit/bsc-money-transit.module").then(mod => mod.BscMoneyTransitModule)
    },
    {
        path: "bsc-signage-cover",
        loadChildren: () => import("./bsc-signage/bsc-signage.module").then(mod => mod.BscSignageModule)
    },
    {
        path: "bsc-liability-section-cover",
        loadChildren: () => import("./bsc-liability/bsc-liability.module").then(mod => mod.BscLiabilityModule)
    },
    {
        path: "bsc-fidelity-guarantee-cover",
        loadChildren: () => import("./bsc-fidelity-gurantee/bsc-fidelity-gurantee.module").then(mod => mod.BscFidelityGuranteeModule)
    },
    {
        path: "bsc-fixed-plate-glass-cover",
        loadChildren: () => import("./bsc-fixed-plate-glass/bsc-fixed-plate-glass.module").then(mod => mod.BscFixedPlateGlassModule)
    },
    {
        path: "bsc-accompanied-baggage-cover",
        loadChildren: () => import("./bsc-accompanied-baggage/bsc-accompanied-baggage.module").then(mod => mod.BscAccompaniedBaggageModule)
    },
    {
        path: "bsc-portable-equipments-cover",
        loadChildren: () => import("./bsc-portable-equipments/bsc-portable-equipments.module").then(mod => mod.BscPortableEquipmentsModule)
    },
    {
        path: "addon-cover-sectors",
        loadChildren: () => import("./addon-cover-sector/addon-cover-sector.module").then(mod => mod.AddonCoverSectorModule)
    },
    {
        path: "quote-location-addon",
        loadChildren: () => import("./quote-location-addon/quote-location-addon.module").then(mod => mod.QuoteLocationAddonModule)
    },
    {
        path: "quote-location-occupancy",
        loadChildren: () => import("./quote-location-occupancy/quote-location-occupancy.module").then(mod => mod.QuoteLocationOccupancyModule)
    },
    {
        path: "quote-location-breakup-master",
        loadChildren: () => import("./quote-location-breakup-master/quote-location-breakup-master.module").then(mod => mod.QuoteLocationBreakupMasterModule)
    },
    {
        path: "list-of-value-master",
        loadChildren: () => import("./list-of-value-master/list-of-value-master.module").then(mod => mod.ListOfValueMasterModule)
    },
    {
        path: "under-writer",
        loadChildren: () => import("./under-writer/under-writer.module").then(mod => mod.UnderWriterModule)
    },
    {
        path: "broker-module-mapping",
        loadChildren: () => import("./broker-module-mapping/broker-module-mapping.module").then(mod => mod.BrokerModuleMappingModule)
    },
    {
        path: "claim-experience",
        loadChildren: () => import("./claim-experience/claim-experience.module").then(mod => mod.ClaimExperienceModule)
    },
    {
        path: "bsc-product-partner-configuration",
        loadChildren: () => import("./bsc-product-partner-configuration/bsc-product-partner-configuration.module").then(mod => mod.BscProductPartnerConfigurationModule)
    },
    {
        path: "declaration-policy-cover",
        loadChildren: () => import("./declaration-policy-cover/declaration-policy-cover.module").then(mod => mod.DeclarationPolicyCoverModule)
    },
    {
        path: "floater-cover-addon",
        loadChildren: () => import("./floater-cover-addon/floater-cover-addon.module").then(mod => mod.FloaterCoverAddonModule)
    },
    {
        path: "loss-of-rent-cover",
        loadChildren: () => import("./loss-of-rent-cover/loss-of-rent-cover.module").then(mod => mod.LossOfRentCoverModule)
    },
    {
        path: "rent-for-alternative-accomodation-cover",
        loadChildren: () => import("./rent-for-alternative-accomodation-cover/rent-for-alternative-accomodation-cover.module").then(mod => mod.RentForAlternativeAccomodationCoverModule)
    },
    {
        path: "personal-accident-cover",
        loadChildren: () => import("./personal-accident-cover/personal-accident-cover.module").then(mod => mod.PersonalAccidentCoverModule)
    },
    {
        path: "valuable-content-on-agreed-value-basis-cover",
        loadChildren: () => import("./valuable-content-on-agreed-value-basis-cover/valuable-content-on-agreed-value-basis-cover.module").then(mod => mod.ValuableContentOnAgreedValueBasisCoverModule)
    },
    {
        path: "product-partner-configuration",
        loadChildren: () => import("./product-partner-configuration/product-partner-configuration.module").then(mod => mod.ProductPartnerConfigurationModule)
    },
    {
        path: "warranty",
        loadChildren: () => import("./warranty/warranty.module").then(mod => mod.WarrantyModule)
    },
    {
        path: "subjectivity",
        loadChildren: () => import("./subjectivity/subjectivity.module").then(mod => mod.SubjectivityModule)
    },
    {
        path: "exclusion",
        loadChildren: () => import("./exclusion/exclusion.module").then(mod => mod.ExclusionModule)
    },
    {
        path: "product-partner-ic-configuration",
        loadChildren: () => import("./product-partner-ic-configuration/product-partner-ic-configuration.module").then(mod => mod.ProductPartnerIcConfigurationModule)
    },
    {
        path: "email-configuration",
        loadChildren: () => import("./EmailConfiguration/email-configuration.module").then(mod => mod.EmailConfigurationModule)
    },
    {
        path: "email-history",
        loadChildren: () => import("./EmailHistory/email-history.module").then(mod => mod.EmailHistoryModule)
    },
    {
        path: "login-history",
        loadChildren: () => import("./Login-History/login-history.module").then(mod => mod.LoginHistoryModule)
    },
    {
        path: "api-history",
        loadChildren: () => import("./api-history/api-history.module").then(mod => mod.ApiHistoryModule)
    },
    {
        path: "api-template",
        loadChildren: () => import("./api-template/api-template.module").then(mod => mod.ApiTemplateModule)
    },
    {
        path: "transaction-history",
        loadChildren: () => import("./transaction-history/transaction-history.module").then(mod => mod.TransactionHistoryModule)
    },
    {
        path: "merchant",
        loadChildren: () => import("./merchant/merchant.module").then(mod => mod.MerchantModule)
    },
    {
        path: "risk-management-features",
        loadChildren: () => import("./risk-management-features/risk-management-features.module").then(mod => mod.RiskManagementFeaturesModule)
    },
    {
        path: "risk-inspection-master",
        loadChildren: () => import("./risk-inspection-master/risk-inspection-master.module").then(mod => mod.RiskInspectionMasterModule)
    },
    {
        path : "rm-mapped-intermediate",
        loadChildren: () => import("./RmMappedIntermediate/rm-mapped-intermediate.module").then(mod => mod.RmMappedIntermediateModule)
    },
    {
        path : "dynamic-clauses",
        loadChildren: () => import("./dynamic-clauses/dynamic-clauses.module").then(mod => mod.DynamicClausesModule)
    },
    {
        path : "terms-conditions",
        loadChildren: () => import("./terms-conditions/terms-conditions.module").then(mod => mod.TermsConditionsModule)
    },
    {
        path : "bsc-covers-description",
        loadChildren: () => import("./bsc-cover-description/bsc-cover-description.module").then(mod => mod.BscCoverDescriptionModule)
    },
    {
        path: "icrm-contact",
        loadChildren: () => import("./icrm-contact/icrm-contact.module").then(mod => mod.IcrmContactModule)
    },
    {
        path: "tasks",
        loadChildren: () => import("./task/task.module").then(mod => mod.TaskModule)
    },
    {
        path: "task-queue",
        loadChildren: () => import("./task-queue/task-queue.module").then(mod => mod.TaskQueueModule)
    },
    {
        path: "category-product-master-features",
        loadChildren: () => import("./category-product-master-features/category-product-master.module").then(mod => mod.CategoryProductMasterModule)
    },
    {
        path: "branch-master",
        loadChildren: () => import("./branch-master/branch-master.module").then(mod => mod.BranchMasterModule)
    },
    //Intergation-EB [Start]
    {
        path: "gmcmaster",
        loadChildren: () => import("./gmc-master/gmc-master.module").then(mod => mod.GmcMasterModule)
    },
    {
        path: "annualturnover",
        loadChildren: () => import("./annual-turnover/annual-turnover.module").then(mod => mod.AnnualTurnoverModule)
    },
    {
        path: "employeesCounts",
        loadChildren: () => import("./employeesCount/employeesCount.module").then(mod => mod.EmployeesCountsModule)
    },
    {
        path: "emprates",
        loadChildren: () => import("./emp-ratesTemplates/emprates.module").then(mod => mod.EmpRatesModule)
    },
    {
        path: "leadInsurers",
        loadChildren: () => import("./LeadInsurers/leadInsurer.module").then(mod => mod.LeadInsurersModule)
    },
    {
        path: "Co-Insurers",
        loadChildren: () => import("./co-insurers/co-insurers.module").then(mod => mod.CoInsurersModule)
    },
    {
        path: "thirdPartyAdministrators",
        loadChildren: () => import("./thirdPartyAdministrators/thirdPartyAdministrators.module").then(mod => mod.ThirdPartyAdministratorsModule)
    },
    {
        path: "gmctabmaster",
        loadChildren: () => import("./gmctabmaster/gmctabmaster.module").then(mod => mod.GmctabmasterModule)
    },
    {
        path: "suminsured",
        loadChildren: () => import("./sumInsured/suminsured.module").then(mod => mod.SumInsuredModule)
    },
    {
        path: "gmcfiletemplate",
        loadChildren: () => import("./gmc-file-template/gmc-file-template.module").then(mod => mod.GmcFileTemplateModule)
    },
    {
        path: "coveragetypes",
        loadChildren: () => import("./coverageTypes/coveragetypes.module").then(mod => mod.CoverageTypeModule)
    },
    {
        path: "productWiseAge",
        loadChildren: () => import("./product-wise-age-master/product-wise-age.module").then(mod => mod.ProductWiseAgeModule)
    },
    //Marine
    // {
    //     path: "interest",
    //     loadChildren: () => import("./Marine/InterestMaster/interest.module").then(mod => mod.InterestModule)
    // },
    // {
    //     path: "packaging",
    //     loadChildren: () => import("./Marine/PackagingMaster/packaging.module").then(mod => mod.PackagingModule)
    // },
    // {
    //     path: "transitType",
    //     loadChildren: () => import("./Marine/TransitTypeMaster/transitType.module").then(mod => mod.TransitTypeModule)
    // },
    // {
    //     path: "conveyance",
    //     loadChildren: () => import("./Marine/ConveyanceMaster/conveyance.module").then(mod => mod.ConveyanceModule)
    // },
    // {
    //     path: "clausesHeads",
    //     loadChildren: () => import("./Marine/ClausesHeadsMaster/clausesHeads.module").then(mod => mod.ClausesHeadsModule)
    // },
    // {
    //     path: "clauses",
    //     loadChildren: () => import("./Marine/ClausesMaster/clauses.module").then(mod => mod.ClausesModule)
    // },

    //wc
    {
        path: "businesstypes",
        loadChildren: () => import("./wc-business-type/wc-business-type.module").then(mod => mod.BusinessTypeModule)
    },

    {
        path: "wccoveragetypes",
        loadChildren: () => import("./wc-coverage-type/wc-coverage-type.module").then(mod => mod.WCCoverageTypeModule)
    },
    {
        path: "wcRates",
        loadChildren: () => import("./wc-rates-master/wc-rate-master.module").then(mod => mod.WCRatesModule)
    },
    {
        path: "salaryslabs",
        loadChildren: () => import("./wc-salary-slabs/wc-salary-slabs.module").then(mod => mod.SalarySlabsModule)
    },

    {
        path:"wcdescofemployees",
        loadChildren: () => import("./wc-desc-of-employee/wc-desc-of-employee.module").then(mod => mod.WCDescriptionOfEmployeeModule)
    },
    {
        path:"wcTypeOfEmployees",
        loadChildren: () => import("./wc-type-of-employee/wc-type-of-employee.module").then(mod => mod.WCTypeOfEmployeeModule)
    },
    {
        path:"wccoveragemedicalexpenses",
        loadChildren: () => import("./wc-coverage-for-mefical-expenses/wc-coverage-for-mefical-expenses.module").then(mod => mod.WCCoverageForMedicalExpensesModule)
    },
    {
        path: "add-ons-covers-ddl-options",
        loadChildren: () => import("./add-ons-covers-ddl-options/add-ons-covers-ddl-options.module").then(mod => mod.AddOnCoverOptionsModule)
    },
    //Intergation-EB [End]
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
