export default function DetailsPage() {
  return (
    <div className="max-w-2xl pt-20 pb-5 mx-auto flex-center-100vh">
      <div className="pl-4 border-l-2 border-stone-500">
        <div className="text-left ">
          <p className="pb-2 circle-dot">Dress code</p>
          <p className="pb-4 text-justify">
            We want you to feel relaxed and enjoy the day - Think comfortable
            with a little shine: sundresses, nice tops, chinos, button-downs. No
            need for anything formal!
          </p>
          <p className="pb-2 circle-dot">Gifts</p>
          <p className="pb-4 text-justify">
            All we want and need is having you there to celebrate with us!
            Asking you to come over and pay for your drinks is already a lot -
            so please don't worry about gifts. <br />
            If you want to contribute something, add a little donation to our
            wedding pot. (Details to follow soon) <br />
            Alternatively, a small donation to the amazing vet clinic "Happy
            Pets" in Tunisia, run by Mariem who cared so well for our little boy
            Caramel. (Details to follow soon)
          </p>
          <p className="pb-2 circle-dot">
            Accommodation for our friends from abroad
          </p>
          <p className="pb-2 text-justify">
            <ul className="details">
              <li>
                Going fully British but pricey: <br /> The nostalgic and very
                typical British The Clarendon Hotel in Blackheath, 16 Montpelier
                Row, London SE3 0RW (5min from our flat), <br /> We get a
                discounted rate for around 130 per night/one room.
              </li>
              <li>
                A more budget option but decent: <br />
                Travelodge Greenwich, Blackheath Road, London SE10 8DA. <br />{" "}
                Between 70 and 90 per night depending on the day).
              </li>
              <li>
                AirBnB might be best: <br /> However we advise to stay away from
                neighbourhoods like Catford, Deptford, New Cross, Woolwich and
                the centre of Lewisham. Look into Blackheath, Greenwich or Isle
                of Dogs for stays to stay safe and decent in big wild London.
              </li>
            </ul>
          </p>
          <p className="circle-dot">Dietary details</p>
          <p className="text-justify ">
            If you want to eat vegan, leave out meat, or are allergic to
            anything do let us know by July 1st the latest. We will make sure
            you get what you want at the pub buffet. Yum, yum!
          </p>
        </div>
      </div>
    </div>
  );
}
