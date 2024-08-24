import './App.css'
import {Table, TableBody, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck, faCircleXmark, faCircleArrowRight, faFaceMeh, faFaceSmile, faFaceFrown, faDumbbell} from "@fortawesome/free-solid-svg-icons";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Card} from "@/components/ui/card.tsx";

function App() {
  const [openDonations, setOpenDonations] = useState([
      {
          task: "Liegestützen",
          drink: "Pepsi",
          victimName: "Jan",
          difficulty: 0
      },
      {
          task: "Kniebeugen",
          drink: "Schanpps",
          victimName: "Jan2",
          difficulty: 2
      },
      {
          task: "Spaghat",
          drink: "Vodka",
          victimName: "Michael",
          difficulty: 1
      }
  ]);
  const [inProgressDonations, setInProgressDonations] = useState([]);
  const [doneDonations, setDoneDonations] = useState([]);
  const [abortDonations, setAbortDonations] = useState([]);

  const setToProgress = (donation) => {
      setOpenDonations(openDonations.filter(openDonation => openDonation != donation));
      setInProgressDonations(inProgressDonations.concat(donation));
  }

  const abortOpen = (donation) => {
      setOpenDonations(openDonations.filter(openDonation => openDonation != donation));

  }

  const abortInProgress = (donation) => {
      setInProgressDonations(inProgressDonations.filter(inProgressDonation => inProgressDonation != donation));
      setAbortDonations(abortDonations.concat(donation));
  }

  const setToDone = (donation) => {
      setInProgressDonations(inProgressDonations.filter(inProgressDonation => inProgressDonation != donation));
      setDoneDonations(doneDonations.concat(donation));
  }

  const getSize = (donation) => {
      if (donation.difficulty === 0) {
          return "1x";
      }
      if (donation.difficulty === 1) {
          return  "lg";
      }
      return "2x";
  }

  const getColor = (donation) => {
      if (donation.difficulty === 0) {
          return "green";
      }
      if (donation.difficulty === 1) {
          return  "orange";
      }
      return "red";
  }

  return (
    <div className="p-10 flex">
          <div className="flex w-full justify-center flex-col">
              <h1 className="text-4xl font-bold">Challenges</h1>
              {/*All open donations*/}
              <Table className="mt-5">
                  <TableHeader>
                      <TableRow>
                          <td className="text-2xl">Open 4 all</td>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {openDonations.length > 0 && openDonations.map((donation, index) => (
                              <Dialog key={index}>
                                  <DialogTrigger asChild>
                                      <Card className="flex w-full my-4">
                                          <TableRow className="w-full">
                                              <td className="flex justify-between content-center items-center mx-4">
                                                  <div className="text-xl my-4">
                                                      {donation.task}
                                                  </div>
                                                  <div className="flex justify-between items-center">
                                                      <FontAwesomeIcon icon={faDumbbell}
                                                                       color={getColor(donation)}
                                                                       className="me-3 min-width" size={getSize(donation)}/>
                                                      <FontAwesomeIcon icon={faCircleArrowRight} size="2x"/>
                                                  </div>
                                              </td>
                                          </TableRow>
                                      </Card>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                      <DialogHeader>
                                          <DialogTitle>Challenge for {donation.victimName} accepting?</DialogTitle>
                                      </DialogHeader>
                                      <div className="flex gap-4 py-4 justify-center">
                                          Task: {donation.task}
                                      </div>
                                      <DialogFooter>
                                          <DialogClose asChild>
                                              <div className="flex justify-around">
                                                  <FontAwesomeIcon onClick={() => {
                                                      setToProgress(donation)
                                                  }} className="me-3 text-green-500" icon={faCircleCheck}
                                                                   size="3x"/>
                                                  <FontAwesomeIcon onClick={() => {
                                                      abortOpen(donation)
                                                  }} className="text-red-500" icon={faCircleXmark} size="3x"/>
                                              </div>
                                          </DialogClose>
                                      </DialogFooter>
                                  </DialogContent>
                              </Dialog>
                      ))}
                  </TableBody>
              </Table>

              {/*All in progress donations*/}
              <Table className="mt-5">
                  <TableHeader>
                      <TableRow>
                          <td className="text-2xl">In progress</td>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {inProgressDonations.length > 0 && inProgressDonations.map((donation, index) => (
                          <Dialog key={index}>
                              <DialogTrigger asChild>
                                  <Card className="flex w-full my-4">
                                      <TableRow className="w-full">
                                          <td className="flex justify-between content-center items-center mx-4">
                                              <div className="text-xl my-4">
                                                  {donation.task}
                                              </div>
                                              <div className="flex justify-between items-center">
                                                  <FontAwesomeIcon icon={faDumbbell}
                                                                   color={getColor(donation)}
                                                                   className="me-3 min-width" size={getSize(donation)}/>
                                                  <FontAwesomeIcon icon={faCircleArrowRight} size="2x"/>
                                              </div>
                                          </td>
                                      </TableRow>
                                  </Card>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                      <DialogTitle>Did {donation.victimName} successfully finished the
                                          challenge?</DialogTitle>
                                  </DialogHeader>
                                  <div className="flex gap-4 py-4 justify-center">
                                      Task: {donation.task}
                                  </div>
                                  <DialogFooter>
                                      <DialogClose asChild>
                                          <div className="flex justify-around">
                                              <FontAwesomeIcon onClick={() => {
                                                  setToDone(donation)
                                              }} className="me-3 text-green-500" icon={faCircleCheck} size="3x"/>
                                              <FontAwesomeIcon onClick={() => {
                                                  abortInProgress(donation)
                                              }} className="text-red-500" icon={faCircleXmark} size="3x"/>
                                          </div>
                                      </DialogClose>
                                  </DialogFooter>
                              </DialogContent>
                          </Dialog>
                      ))}
                  </TableBody>
              </Table>

              {/*All done donations*/}
              <Table className="mt-5">
                  <TableHeader>
                      <TableRow>
                          <td className="text-2xl">Done</td>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {doneDonations.length > 0 && doneDonations.map((donation, index) => (
                          <Card className="flex w-full my-4">
                              <TableRow key={index} className="w-full">
                                  <td className="flex justify-between content-center items-center mx-4">
                                      <div className="text-xl my-4">
                                          {donation.task} - {donation.drink}
                                      </div>
                                  </td>
                              </TableRow>
                          </Card>
                      ))}
                  </TableBody>
              </Table>

              {/*All chicken out donations*/}
              <Table className="mt-5">
                  <TableHeader>
                      <TableRow>
                          <td className="text-2xl">Chickened out</td>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {abortDonations.length > 0 && abortDonations.map((donation, index) => (
                          <Card className="flex w-full my-4">
                              <TableRow key={index} className="w-full">
                                  <td className="flex justify-between content-center items-center mx-4">
                                      <div className="text-xl my-4">
                                          {donation.task} - {donation.victimName}
                                      </div>
                                  </td>
                              </TableRow>
                          </Card>
                      ))}
                  </TableBody>
              </Table>
          </div>
    </div>
  )
}

export default App