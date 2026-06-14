export default function DetailsPage() {
  return (
    <div className="max-w-2xl pt-20 pb-5 mx-auto flex-center-100vh">
      <div className="pl-4 border-l-2 border-stone-500">
        <div className="text-left ">
          <p className="pb-1 circle-dot">Dress code</p>
          <p className="pb-4 text-justify">
            We want you to feel relaxed and enjoy the day - Think comfortable
            with a little shine: sundresses, nice tops, chinos, button-downs. No
            need for anything formal!
          </p>
          <p className="pb-1 circle-dot">Meetup</p>
          <p className="pb-4 text-justify">
            Predrink and quick lunch at the{" "}
            <a
              className="underline decoration-stone-500"
              href="https://maps.app.goo.gl/YuW4RSv8bikgesz7A"
              target="_blank"
              rel="noopener noreferrer">
              Harvester George Pub
            </a>{" "}
            next to the event from 12:15 onwards, or come straight at the{" "}
            <a
              href="https://maps.app.goo.gl/wXVzTjF84DXsfm5E8"
              target="_blank"
              rel="noopener noreferrer"
              className="underline">
              Registry Office
            </a>{" "}
            at 13:30. The pub is a 5-minute walk from the Mordan Park House.
          </p>
          <p className="pb-1 circle-dot">
            Accommodation for our friends from abroad
          </p>
          <ul className="pb-1 text-justify details">
            <li>
              Going fully British but pricey: <br /> The nostalgic and very
              typical British{" "}
              <a
                className="underline decoration-stone-500"
                href="https://maps.app.goo.gl/HpsMtoh8opJizrqW8"
                target="_blank"
                rel="noopener noreferrer">
                The Clarendon Hotel
              </a>{" "}
              in Blackheath, 16 Montpelier Row, London SE3 0RW (5min from our
              flat), <br /> We get a discounted rate for around 130 per
              night/one room.
            </li>
            <li>
              A more budget option but decent: <br />
              Travelodge Greenwich, Blackheath Road, London SE10 8DA. <br />{" "}
              Between 70 and 90 per night depending on the day).
            </li>
            <li>
              AirBnB might be best: <br /> However we advise to stay away from
              neighbourhoods like Catford, Deptford, New Cross, Woolwich and the
              centre of Lewisham. Look into Blackheath, Greenwich or Isle of
              Dogs for stays to stay safe and decent in big wild London.
            </li>
          </ul>
          <p className="pb-1 circle-dot">Dietary details</p>
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
