interface SensitivitySliderProps {
    value: number;
    onChange: (value: number) => void;
  }
  
  const SensitivitySlider: React.FC<SensitivitySliderProps> = ({ value, onChange }) => {
    return (
      <div className="flex flex-col rounded-xl bg-muted/50 p-4 mb-3">
        <h1 className="text-1xl font-bold">Sensitivity</h1>
        <input
          type="range"
          className="w-full accent-neutral-300"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    );
  };
  
  export default SensitivitySlider;
  