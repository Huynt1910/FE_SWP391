import advantagesData from "@data/advantage/advantage";
import { Card } from "./Card/Card";

export const Advantage = () => {
  const advantages = [...advantagesData];
  return (
    <>
      {/* <!-- BEGIN ADVANTAGES --> */}
      <div className="advantages">
        <div className="wrapper">
          <div className="advantages-items">
            {advantages.map((advantage, index) => (
              <Card key={index} advantage={advantage} />
            ))}
          </div>
        </div>
      </div>
      {/* <!-- ADVANTAGES EOF   --> */}
    </>
  );
};
