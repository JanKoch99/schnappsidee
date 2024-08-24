import './App.css'
import {Table, TableBody, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck, faCircleXmark, faDumbbell} from "@fortawesome/free-solid-svg-icons";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Card} from "@/components/ui/card.tsx";
import {Donation} from "@/models/Donation.tsx";
import {config} from "@/Constants.js.ts";
import confetti, {Shape} from "canvas-confetti";
import chickenSoundUrl from './assets/chickenSound.mp3';
import TimerManager from "@/helpers/TimerManager.tsx";


function App() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [openDonations, setOpenDonations] = useState<Donation[]>([]);
  const [inProgressDonations, setInProgressDonations] = useState<Donation[]>([]);
  const [doneDonations, setDoneDonations] = useState<Donation[]>([]);
  const [abortDonations, setAbortDonations] = useState<Donation[]>([]);
  const URL: string =config.url;
  const chickenSound = new Audio(chickenSoundUrl);


  useEffect(() => {
      const fetchDonations = async () => {
          const response = await fetch(`${URL}/api/donations`);
          const json = await response.json();
          if (response.ok) {
              setDonations(json as Donation[]);
          }
      }
      fetchDonations();

  }, [URL]);

  useEffect(() => {
      if (donations.length > 0) {
          const newOpenDonations: Donation[] = [];
          const newInProgressDonations: Donation[] = [];
          const newDoneDonations: Donation[] = [];
          const newAbortDonations: Donation[] = [];
          const remainingDonations: Donation[] = [];

          donations.forEach((donation: Donation) => {
              if (donation.taskState === "open") {
                  newOpenDonations.push(donation);
              } else if (donation.taskState === "inProgress") {
                  newInProgressDonations.push(donation);
              } else if (donation.taskState === "done") {
                  newDoneDonations.push(donation);
              } else if (donation.taskState === "chicken") {
                  newAbortDonations.push(donation);
              } else {
                  remainingDonations.push(donation);
              }
          });

          setOpenDonations(newOpenDonations);
          setInProgressDonations(newInProgressDonations);
          setDoneDonations(newDoneDonations);
          setAbortDonations(newAbortDonations);
          setDonations(remainingDonations);
      }

  }, [donations])


    const eventSource = new EventSource(`${URL}/events`);
    eventSource.onmessage = function (event) {
        const newDonation = JSON.parse(event.data);
        const donationArray: Donation[] = [...donations, newDonation]
        setDonations(donationArray);
        triggerConfetti("");
    }

  const updateDonation = async (donation: Donation, taskState: string) => {
      donation.taskState = taskState;
      const response = await fetch(`${URL}/api/donations/${donation._id}`, {
          method: "PATCH",
          body: JSON.stringify(donation),
          headers: {
              'Content-Type': 'application/json',
          }
      });
      await response.json();
    }

  const setToProgress = async (donation: Donation) => {
      setOpenDonations(openDonations.filter(openDonation => openDonation != donation));
      setInProgressDonations(inProgressDonations.concat(donation));
      await updateDonation(donation, "inProgress");
  }

  const abortOpen = async (donation: Donation) => {
      setOpenDonations(openDonations.filter(openDonation => openDonation != donation));
      await fetch(`${URL}/api/donations/${donation._id}`, {
          method: "DELETE",
          body: JSON.stringify(donation),
          headers: {
              'Content-Type': 'application/json',
          }
      })

  }

  const abortInProgress = async (donation: Donation) => {
      try {
          await chickenSound.play();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (ignored) {
          console.log("For sound you need to click in the application");
      }
      setInProgressDonations(inProgressDonations.filter(inProgressDonation => inProgressDonation != donation));
      setAbortDonations(abortDonations.concat(donation));
      await updateDonation(donation, "chicken");
      triggerConfetti("chicken");
  }

  const setToDone = async (donation: Donation) => {
      setInProgressDonations(inProgressDonations.filter(inProgressDonation => inProgressDonation != donation));
      setDoneDonations(doneDonations.concat(donation));
      triggerConfetti("money");
      await updateDonation(donation, "done");
  }

  const getSize = (donation: Donation) => {
      if (donation.difficulty === 0) {
          return "1x";
      }
      if (donation.difficulty === 1) {
          return  "lg";
      }
      return "2x";
  }

  const getColor = (donation: Donation) => {
      if (donation.difficulty === 0) {
          return "green";
      }
      if (donation.difficulty === 1) {
          return  "orange";
      }
      return "red";
  }

    const triggerConfetti = (emoji: string) => {
        const scalar: number = 7;
        const shapes: Shape[] = []
        if (emoji === "money") {
            shapes.push(confetti.shapeFromText({text: '💸', scalar: scalar}))
        } else if (emoji === "chicken") {
            shapes.push(confetti.shapeFromText({text: '🪶', scalar: scalar}))
        } else {
            shapes.push(confetti.shapeFromText({text: '🍺', scalar: scalar}))
            shapes.push(confetti.shapeFromText({text: '🍷', scalar: scalar}))
            shapes.push(confetti.shapeFromText({text: '🍸', scalar: scalar}))
        }

        const end = Date.now() + 1000; // Confetti duration

        (function frame() {

            confetti({
                particleCount: 1,
                angle: 60,
                spread: 30,
                origin: { x: 0 },
                scalar: scalar,
                shapes: shapes,
                ticks: 100,
                gravity: 0.05,
                zIndex: 2000,
                startVelocity: 15,
                disableForReducedMotion: true,
            });

            confetti({
                particleCount: 1,
                angle: 120,
                spread: 30,
                origin: { x: 1 },
                scalar: scalar,
                shapes: shapes,
                ticks: 100,
                gravity: 0.05,
                zIndex: 2000,
                startVelocity: 15,
                disableForReducedMotion: true,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    };

    const getRemainingTime = (donation: Donation): number => {
        const now = new Date();
        const updatedAt = new Date(donation.updatedAt);
        return Math.max(0, 60 - ((now.getTime() - updatedAt.getTime()) / 1000 / 60));
    }

  const abortOpens = async (donationsToRemove: Donation[]) => {
      setOpenDonations(openDonations.filter(openDonation => !donationsToRemove.includes(openDonation)));
      for (const donation of donationsToRemove) {
          await fetch(`${URL}/api/donations/${donation._id}`, {
              method: "DELETE",
              body: JSON.stringify(donation),
              headers: {
                  'Content-Type': 'application/json',
              }
          })
      }
  }

  const abortInProgresses = async (donationsToRemove: Donation[]) => {
      setInProgressDonations(inProgressDonations.filter(inProgressDonation => !donationsToRemove.includes(inProgressDonation)));
      setAbortDonations(abortDonations.concat(donationsToRemove));
      for (const donation of donationsToRemove) {
          await updateDonation(donation, "chicken");
      }
  }

  const checkForExpiredTimer = async () => {
      let abortOpenArray: Donation[] = [];
      let abortInProgressArray: Donation[] = [];
      for (const donation of openDonations) {
          if (getRemainingTime(donation) <= 0) {
              abortOpenArray = [...abortOpenArray, donation];
          }
      }
      for (const donation of inProgressDonations) {
          if (getRemainingTime(donation) <= 0) {
              abortInProgressArray = [...abortInProgressArray, donation];
          }
      }

      if (abortOpenArray.length > 0) {
          await abortOpens(abortOpenArray);
      }
      if (abortInProgressArray.length > 0) {
          await abortInProgresses(abortInProgressArray);
      }
  }

    new TimerManager(checkForExpiredTimer);

    return (
    <div className="p-10 flex">
          <div className="flex w-full justify-center flex-col">
              <h1 className="text-4xl font-bold">vera calma</h1>
              {/*All open donations*/}
              <Table className="mt-5">
                  <TableHeader>
                      <TableRow>
                          <td className="text-2xl font-bold">Open 4 all</td>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {openDonations.length > 0 && openDonations.map((donation: Donation, index: number) => (
                              <Dialog key={index}>
                                  <DialogTrigger asChild>
                                      <Card className="flex w-full my-4">
                                          <TableRow className="w-full">
                                              <td className="flex justify-between content-center items-center mx-4">
                                                  <div className="text-xl my-4">
                                                      {donation.task}
                                                  </div>
                                                  <div className="flex justify-between items-center">
                                                      <div className="timer" data-updated-at={donation.updatedAt}>
                                                          {(60 - getRemainingTime(donation)).toFixed(0)}'
                                                      </div>
                                                      <FontAwesomeIcon icon={faDumbbell}
                                                                       color={getColor(donation)}
                                                                       className="min-width ms-1"
                                                                       size={getSize(donation)}/>
                                                  </div>
                                              </td>
                                          </TableRow>
                                      </Card>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                      <DialogHeader>
                                          <DialogTitle>Challenge for {donation.victimName} accepting?</DialogTitle>
                                      </DialogHeader>
                                      <div className="flex gap-4 pt-4 justify-center">
                                          Task: {donation.task}
                                      </div>
                                      {donation.price &&
                                          <div className="flex gap-4 pb-4 justify-center">
                                              Price: CHF {donation.price.toFixed(2)}
                                          </div>}
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
                          <td className="text-2xl font-bold">In progress</td>
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
                                                  <div className="timer" data-updated-at={donation.updatedAt}>
                                                      {(60 - getRemainingTime(donation)).toFixed(0)}'
                                                  </div>
                                                  <FontAwesomeIcon icon={faDumbbell}
                                                                   color={getColor(donation)}
                                                                   className="min-width" size={getSize(donation)}/>
                                              </div>
                                          </td>
                                      </TableRow>
                                  </Card>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                      <DialogTitle>Did {donation.victimName} successfully finish the
                                          challenge?</DialogTitle>
                                  </DialogHeader>
                                  <div className="flex gap-4 pt-4 justify-center">
                                      Task: {donation.task}
                                  </div>
                                  {donation.price &&
                                      <div className="flex gap-4 pb-4 justify-center">
                                          Price: CHF {donation.price.toFixed(2)}
                                      </div>
                                  }
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
                          <td className="text-2xl font-bold">Done</td>
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
                          <td className="text-2xl font-bold">Chickened out</td>
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