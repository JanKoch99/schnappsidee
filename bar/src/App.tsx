import './App.css'
import {Table, TableBody, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck, faCircleXmark, faCircleArrowRight, faDumbbell} from "@fortawesome/free-solid-svg-icons";
import {
    Dialog, DialogClose,
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

        const eventSource = new EventSource(`${URL}/events`);
        eventSource.onmessage = function (event) {
            const newDonation = JSON.parse(event.data);
            console.log(newDonation)
            setOpenDonations((prevOpenDonations) => {
                if (!prevOpenDonations.some((donation) => donation._id === newDonation._id)) {
                    return [...prevOpenDonations, newDonation];
                }
                return prevOpenDonations;
            });

            /*setDonations((prevDonations) => {
                if (!prevDonations.some((donation) => donation._id === newDonation._id)) {
                    return [...prevDonations, newDonation];
                }
                return prevDonations;
            });*/
        }
        return () => {
            eventSource.close()
        }
    }, []);

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


    //TODO: If new donation is added call:       triggerConfetti();

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
      await chickenSound.play();
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

  const checkForExpiredTimer = async () => {
      const now = new Date();
      for (const donation of donations) {
        const updatedAt = new Date(donation.updatedAt);
        const remainingTime = Math.max(0, 60 - ((now.getTime() - updatedAt.getTime()) / 1000 / 60));
        if (remainingTime <= 0) {
            if (donation.taskState === "open") {
                await abortOpen(donation);
            } else {
                await abortInProgress(donation);
            }
        }
      }
  }

    new TimerManager(checkForExpiredTimer);

    return (
    <div className="p-10 flex">
          <div className="flex w-full justify-center flex-col">
              {/*TODO: Add bar name*/}
              <h1 className="text-4xl font-bold">Challenges</h1>
              {/*All open donations*/}
              <Table className="mt-5">
                  <TableHeader>
                      <TableRow>
                          <td className="text-2xl">Open 4 all</td>
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
                                                  <div className="timer" data-updated-at={donation.updatedAt}>
                                                      60 min
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
                                              <div className="timer" data-updated-at={donation.updatedAt}>
                                                  60 min
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
                                      <DialogTitle>Did {donation.victimName} successfully finish the
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