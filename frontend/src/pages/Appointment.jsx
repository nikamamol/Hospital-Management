import AppointmentForm from "../components/AppointmentForm"
import Hero from "../components/Hero"

function Appointment() {
  return (
    <div>
       <Hero
        title={"Schedule Your Appointment | ZeeCare Medical Institute"}
        imageUrl={"/signin.png"}
      />
      <AppointmentForm/>
    </div>
  )
}

export default Appointment
