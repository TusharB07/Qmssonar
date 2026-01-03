// import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
// import { Component, OnInit } from '@angular/core';
// import { Board } from '../models/board.model';

// @Component({
//   selector: 'app-todo-list',
//   templateUrl: './todo-list.component.html',
//   styleUrls: ['./todo-list.component.scss']
// })
// export class TodoListComponent implements OnInit {

//   board: Board =
//     {
//       name: 'Kanban',
//       columns: [
//         {
//           name: 'Work In Progress',
//           cards: [
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: '../../../../../assets/client.png',
//                 imageURL2: '../../../../../assets/client.png',
//                 imageURL3: '../../../../../assets/client.png'
//               }
//             },
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: './assets/abc.jpg',
//                 imageURL2: './assets/abc.jpg',
//                 imageURL3: './assets/abc.jpg'
//               }
//             },
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: './assets/abc.jpg',
//                 imageURL2: './assets/abc.jpg',
//                 imageURL3: './assets/abc.jpg'
//               }
//             },
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: './assets/abc.jpg',
//                 imageURL2: './assets/abc.jpg',
//                 imageURL3: './assets/abc.jpg'
//               }
//             }
//           ]
//         },
//         {
//           name: 'Under Review',
//           cards: [
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: './assets/abc.jpg',
//                 imageURL2: './assets/abc.jpg',
//                 imageURL3: './assets/abc.jpg'
//               }
//             },
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: '../../../../../assets/client.png',
//                 imageURL2: '../../../../../assets/client.png',
//                 imageURL3: '../../../../../assets/client.png'
//               }
//             },
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: './assets/abc.jpg',
//                 imageURL2: './assets/abc.jpg',
//                 imageURL3: './assets/abc.jpg'
//               }
//             },
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: './assets/abc.jpg',
//                 imageURL2: './assets/abc.jpg',
//                 imageURL3: './assets/abc.jpg'
//               }
//             }
//           ]
//         },
//         {
//           name: 'Completed',
//           cards: [
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: '../../../../../assets/client.png',
//                 imageURL2: '../../../../../assets/client.png',
//                 imageURL3: '../../../../../assets/client.png'
//               }
//             },
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: './assets/abc.jpg',
//                 imageURL2: './assets/abc.jpg',
//                 imageURL3: './assets/abc.jpg'
//               }
//             },
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: './assets/abc.jpg',
//                 imageURL2: './assets/abc.jpg',
//                 imageURL3: './assets/abc.jpg'
//               }
//             },
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: './assets/abc.jpg',
//                 imageURL2: './assets/abc.jpg',
//                 imageURL3: './assets/abc.jpg'
//               }
//             }
//           ]
//         },
//         {
//           name: 'Revised',
//           cards: [
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: './assets/abc.jpg',
//                 imageURL2: './assets/abc.jpg',
//                 imageURL3: './assets/abc.jpg'
//               }
//             },
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: './assets/abc.jpg',
//                 imageURL2: './assets/abc.jpg',
//                 imageURL3: './assets/abc.jpg'
//               }
//             },
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: './assets/abc.jpg',
//                 imageURL2: './assets/abc.jpg',
//                 imageURL3: './assets/abc.jpg'
//               }
//             },
//             {
//               details: {
//                 header: 'Industry Avearge Quote',
//                 policyName: 'Fire Insurance Policy - Retail',
//                 imageURL1: '../../../../../assets/client.png',
//                 imageURL2: '../../../../../assets/client.png',
//                 imageURL3: '../../../../../assets/client.png'
//               }
//             }
//           ]
//         },
//       ]
//     }

//   constructor() { }

//   ngOnInit(): void {
//   }

//   drop(event: CdkDragDrop<string[]>) {
//     if (event.previousContainer === event.container) {
//       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//     } else {
//       transferArrayItem(event.previousContainer.data,
//         event.container.data,
//         event.previousIndex,
//         event.currentIndex);
//     }
//   }


// }
