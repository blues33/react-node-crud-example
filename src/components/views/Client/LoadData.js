// import * as React from 'react'
// import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
// import * as Moment from 'moment'
// import * as momentLocalizer from 'react-widgets-moment'
// import * as DateTimePicker from 'react-widgets/lib/DateTimePicker'
// import { SelectClientAction } from '../../../../action'
// Moment.locale('en')
// momentLocalizer()

// export default class LoadData extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       client: {},
//       startDate: new Date(),
//       endDate: new Date()
//     }
//   }
//   componentDidMount () {
//     if (this.props.match.params.id) {
//       new SelectClientAction(this.props.match.params.id).dispatch()
//     }
//   }
//   handleSubmit (e: any) {
//     console.log()
//   }
//   handleCancel (e: any) {
//     this.props.history.push('/client')
//   }
//   render () {
//     const selectedClient = this.props.selectedClient
//     return <div className="animated fadeIn h-100 w-100">
//       <h2>Workday Web Service</h2>
//       { selectedClient &&
//         <Form className="m-t-30">
//           <FormGroup>
//             <Label>Start Date: </Label>
//             <DateTimePicker value={this.state.startDate} onChange={value => this.setState({ startDate: value })}
//             time={false} max={this.state.endDate} />
//           </FormGroup>
//           <FormGroup>
//             <Label>End Date: </Label>
//             <DateTimePicker value={this.state.endDate} onChange={value => this.setState({ endDate: value })}
//             time={false} min={this.state.startDate} />
//           </FormGroup>
//           <FormGroup>
//             <Label for="clientName">Client Name </Label>
//             <Input name="clientName" id="clientName" defaultValue={selectedClient.name} />
//           </FormGroup>
//           <FormGroup>
//             <Label for="url">Workday Report URL: </Label>
//             <Input name="url" id="url" placeholder="e.g: hppts://wd2-impl-services1.workday.com/ccx/service/customreport"
//              defaultValue={selectedClient.url}/>
//           </FormGroup>
//           <FormGroup>
//             <Label for="version">Select Web Service Version: </Label>
//             <Input type="select" name="version" id="version">
//               <option>28.1</option>
//             </Input>
//           </FormGroup>
//           <FormGroup>
//             <Label for="username">Credentials: </Label>
//             <Input name="username" id="username" placeholder="User Name" defaultValue={selectedClient.username} />
//             <Input type="password" name="password" id="password" placeholder="Password" defaultValue={selectedClient.pwd} />
//           </FormGroup>
//           <Button color="primary" onClick={this.handleSubmit.bind(this)}>Load</Button>
//           <Button onClick={this.handleCancel.bind(this)} className="m-l-20">Cancel</Button>
//         </Form>
//       }
//     </div>
//   }
// }