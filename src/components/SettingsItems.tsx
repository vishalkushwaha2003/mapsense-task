import { Button } from "@mui/material";
import { useState, ChangeEvent } from "react";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

interface SettingsItemsProps {
  handleRadiusChangeClicked: (radiusValue: number) => void;
}

const SettingsItems: React.FC<SettingsItemsProps> = ({
  handleRadiusChangeClicked,
}) => {
  const [radiusValue, setRadiusValue] = useState<number>(100);
  const [isClicked, setIsClickedItem] = useState<boolean>(true);

  const handleRadiusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRadiusValue(Number(e.target.value));
  };

  const handleClick = () => {
    handleRadiusChangeClicked(radiusValue);
    setIsClickedItem(!isClicked);
  };

  return (
    <div className="mt-5">
     <div className="text-center">Set Radius</div>
      <div className="flex justify-center p-2">
        
        <input
          type="number"
          className={`outline-none w-36 rounded-md px-1  ${isClicked ? "bg-slate-300" : ""}`}
          placeholder="Set Radius"
          value={radiusValue}
          onChange={handleRadiusChange}
          disabled={isClicked}
        />
        {isClicked ? (
          <EditOutlinedIcon className= 'hover:cursor-pointer'  onClick={() => setIsClickedItem(!isClicked)} />
        ) : (
          <Button
            sx={{
              width: "30px",
              height: "30px",
              fontSize: "12px",
              backgroundColor: "rgb(14 116 144)",
            }}
            variant="contained"
            onClick={handleClick}
          >
            Apply
          </Button>
        )}
      </div>
    </div>
  );
};

export default SettingsItems;
