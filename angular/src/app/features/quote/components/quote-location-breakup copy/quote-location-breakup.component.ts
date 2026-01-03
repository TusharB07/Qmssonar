import { Component, Input, OnInit } from '@angular/core';
import { Children } from 'preact/compat';
import { TreeNode } from 'primeng/api';
import { IManyResponseDto, PermissionType } from 'src/app/app.model';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { IProduct } from 'src/app/features/admin/product/product.model';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';



@Component({
    selector: 'app-quote-location-breakup',
    templateUrl: './quote-location-breakup.component.html',
    styleUrls: ['./quote-location-breakup.component.scss']
})
export class QuoteLocationBreakupComponent implements OnInit {


    @Input() quote: IQuoteSlip

    @Input() permissions: PermissionType[] = []

    constructor(
        private listOfValuesMasterService: ListOfValueMasterService,
    ) { }

    headers = [
        { id: '', label: 'Frozen' },
        { id: '1', label: 'Mumbai' },
        { id: '2', label: 'Chennai' },
        { id: '3', label: 'Nagpur' },
        { id: 'total', label: 'Total' },
    ]

    model: any[] = []

    data: TreeNode<{
        name: string,
        cols: Array<{ id: string, value: string | number, type: "plainText" | "inputText" }>,

    }>[] =
        [
            // {
            //     data: {
            //         name: "documents",
            //         cols: [
            //             {
            //                 id: '1',
            //                 value: "75kb",
            //                 type: "inputText",
            //             },
            //             {
            //                 id: '2',
            //                 value: "80kb",
            //                 type: "inputText",
            //             },
            //             {
            //                 id: '2',
            //                 value: "80kb",
            //                 type: "inputText",
            //             },
            //             {
            //                 id: 'total',
            //                 value: "500",
            //                 type: "plainText",
            //             }
            //         ]
            //     },
            //     expanded: true,
            //     children: [
            //     ]
            // },
        ]


    ngOnInit(): void {


        let payload = [
            {
                name: 'Documents',
                cols: [
                    {
                        id: '1',
                        value: 500,
                        type: "inputText",
                    },
                ],
                children: [
                    {
                        name: 'Files',
                        cols: [
                            {
                                id: '1',
                                value: 500,
                                type: "inputText",
                            },
                        ],
                    }
                ]
            }
        ]

        function makeModel(model, data, headers, item) {


            model[item.name] = []

            let total = 0;

            let newData = {
                name: item.name,
                cols: headers.filter(header => header.id != '').map((header) => {
                    let col = item.cols.find((col) => col.id == header.id)

                    if (col) {
                        total = total + col?.value ?? 0
                        // console.log(col?.value)
                    }

                    model[item.name][header.id] = header.id == 'total' ? total : col?.value ?? 0

                    return header.id == 'total' ? {
                        id: 'total',
                        type: 'plainText',
                        value: item.value,
                    } : {
                        id: header.id,
                        type: 'inputText',
                        value: item.value,

                    }
                })
            }
            if (item.children) {
                // console.log(data)

                // newData['children'] =
                // console.log('withChildren', newData)

                return {
                    data: newData, children: item.children.map((child) =>
                        makeModel(model, data, headers, child)
                    ),
                    expanded: true
                }
            } else {
                // console.log('newData', newData)
                return { data: newData }
            }

            // if (item?.children) {
            //     return {
            //         data: newData,
            //         children: item.children?.map((child) => makeModel(model, newData, headers, child))
            //     }
            // } else {
            //     return data.push({
            //         data: newData,
            //     })

            // }

            // return data.push({
            //     data: newData,
            //     children: item.children?.map((child) => makeModel(model, data, headers, child))
            // })
        }

        payload.map((item: any) => {
            this.data.push(makeModel(this.model, this.data, this.headers, item))
        })

        // payload.map((item: any) => {

        //     this.model[item.name] = []
        //     this.data.push({
        //         data: {
        //             name: item.name,
        //             cols: this.headers.filter(header => header.id != '').map((header) => {
        //                 let col = item.cols.find((col) => col.id == header.id)

        //                 this.model[item.name][header.id] = col?.value ?? 0

        //                 return {
        //                     id: header.id,
        //                     value: item.value,
        //                     type: 'inputText'
        //                 }
        //             })
        //         }
        //     })
        // })

        // this.data.push(
        //     {
        //         data: {
        //             name: "documents",
        //             cols: [
        //                 {
        //                     id: '1',
        //                     value: "75kb",
        //                     type: "inputText",
        //                 },
        //                 {
        //                     id: '2',
        //                     value: "80kb",
        //                     type: "inputText",
        //                 },
        //                 {
        //                     id: '3',
        //                     value: "80kb",
        //                     type: "inputText",
        //                 },
        //                 {
        //                     id: 'total',
        //                     value: "500",
        //                     type: "plainText",
        //                 }
        //             ]
        //         },
        //         expanded: true,
        //         children: [
        //         ]
        //     },
        // )
        // this.data.push(
        //     {
        //         data: {
        //             name: "files",
        //             cols: [
        //                 {
        //                     id: '1',
        //                     value: "75kb",
        //                     type: "inputText",
        //                 },
        //                 {
        //                     id: '2',
        //                     value: "80kb",
        //                     type: "inputText",
        //                 },
        //                 {
        //                     id: '3',
        //                     value: "80kb",
        //                     type: "inputText",
        //                 },
        //                 {
        //                     id: 'total',
        //                     value: "500",
        //                     type: "plainText",
        //                 }
        //             ]
        //         },
        //         expanded: true,
        //         children: [
        //         ]
        //     },
        // )

        this.model['Total Sum Insured'] = []
        this.data.push({
            data: {
                name: 'Total Sum Insured',
                cols: this.headers.filter(header => header.id != '').map((header) => {

                    // console.log()
                    // this.model['Total Sum Insured'][header.id] = 0

                    Object.entries(this.model).forEach(([item, value]) => {
                        if (item != 'Total Sum Insured') {
                            Object.entries(value).forEach(([index, data]) => {
                                this.model['Total Sum Insured'][index] = 0
                            })
                        }
                    })
                    Object.entries(this.model).forEach(([item, value]) => {
                        if (item != 'Total Sum Insured') {
                            Object.entries(value).forEach(([index, data]) => {
                                this.model['Total Sum Insured'][index] = this.model['Total Sum Insured'][index] + Number(data)
                            })
                        }
                    })

                    return {
                        id: header.id,
                        type: 'plainText',
                        value: 0,
                    }

                })
            }
        })

        // Create model for payload
        // this.data.map((item: TreeNode) => {

        //     this.model[item.data.name] = []


        //     item.data.cols.map((data) => {
        //         this.model[item.data.name][data.id] = 0
        //     })
        // })


        // this.model['documents'] = []
        // this.model['documents']['1'] = 0
        // this.model['documents']['2'] = 0
        // this.model['documents']['3'] = 0
        // this.model['documents']['total'] = 0


        // this.model['files'] = []
        // this.model['files']['1'] = 0
        // this.model['files']['2'] = 0
        // this.model['files']['3'] = 0
        // this.model['files']['total'] = 0

        let product = this.quote.productId as IProduct

        if (product) {


            this.listOfValuesMasterService.current(AllowedListOfValuesMasters.QUOTE_LOCATION_BREAKUP_L1, product._id).subscribe({
                next: (dto: IManyResponseDto<IListOfValueMaster>) => {
                    // this.lovTreeMapping.next(dto.data.entities)
                    // console.log(dto.data.entities)

                    // this.breakupMap = dto.data.entities

                    // dto.data.entities.map((item: IListOfValueMaster) => {
                    //     console.log(item);
                    // })

                },
                error: e => { }

            })
        }
    }
    updated(key) {
        // console.log(e)
        this.model[key]['total'] = 0

        this.model[key].filter(item => item != 'total').map((item => {
            this.model[key]['total'] = this.model[key]['total'] + item
        }))


        Object.entries(this.model).forEach(([item, value]) => {
            if (item != 'Total Sum Insured') {
                console.log(item)
                console.log('value', value)

                // this.model['Total Sum Insured']

                Object.entries(value).forEach(([index, data]) => {

                    this.model['Total Sum Insured'][index] = 0
                    // console.log('index', index)
                    // console.log('data', data)

                })
            }
        })
        Object.entries(this.model).forEach(([item, value]) => {
            if (item != 'Total Sum Insured') {
                console.log(item)
                console.log('value', value)

                // this.model['Total Sum Insured']

                Object.entries(value).forEach(([index, data]) => {

                    this.model['Total Sum Insured'][index] = this.model['Total Sum Insured'][index] + data
                    // console.log('index', index)
                    // console.log('data', data)

                })
            }
        })
        console.log(this.model['Total Sum Insured'])

    }
}
