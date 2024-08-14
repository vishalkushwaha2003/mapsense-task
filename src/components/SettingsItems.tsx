import { Button } from "@mui/material";
import { useState, ChangeEvent } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

interface SettingsItemsProps {
  handleRadiusChangeClicked: (radiusValue: number) => void;
  handleZoomValSlider: (zoomVal: number) => void;
}

const SettingsItems: React.FC<SettingsItemsProps> = ({
  handleRadiusChangeClicked,
  handleZoomValSlider,
}) => {
  
  const [userRadius, setUserRadius] = useState<number>(100);
  const [isClicked, setIsClickedItem] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const handleRadiusChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseInt(e.target.value);
    setUserRadius(newRadius);

    if (newRadius >= 100 && newRadius <= 3000) {
      
      setError(""); // Clear any previous error messages
    } else {
      setError("Enter between 99 and 3001"); // Show error message
    }

    
  };

  const handleClick = () => {
    if (userRadius >= 100 && userRadius <= 3000) {
      handleRadiusChangeClicked(userRadius);
    
      setIsClickedItem(!isClicked);
      
    } else {
      alert("Please enter a valid radius before applying.");
    }
  };

  const handleSliderChange = (_event: Event, value: number | number[]) => {
    handleZoomValSlider(value as number);
  };

  return (
    <div className="mt-5">
      <div className="text-center">Set Radius</div>
      <div className="flex justify-center p-2">
        <input
          type="number"
          className={`outline-none w-36 rounded-md px-1  ${
            isClicked ? "bg-slate-300" : ""
          }`}
          placeholder="Set Radius"
          value={userRadius}
          onChange={handleRadiusChange}
          disabled={isClicked}
        />
        {isClicked ? (
          <EditOutlinedIcon
            className="hover:cursor-pointer"
            onClick={() => setIsClickedItem(!isClicked)}
          />
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
      {error && (
        <div className="font-bold text-red-800 text-center mt-2">
          {error}
        </div>
      )}

      <div className="mt-4">
        <div className="text-center">- Set Zoom +</div>
        <Box sx={{ width: 200, margin: "auto" }}>
          <Slider
            size="small"
            onChange={handleSliderChange}
            defaultValue={70}
            aria-label="Small"
            valueLabelDisplay="auto"
            sx={{
              color: "rgb(15 23 42)",
            }}
          />
        </Box>
      </div>
    </div>
  );
};

export default SettingsItems;
