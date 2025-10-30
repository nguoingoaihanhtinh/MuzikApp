import React from "react";
import Select, { SingleValue } from "react-select";
import { User } from "@/types/global";
import { ControllerRenderProps } from "react-hook-form";
import { FormValues } from "../../upload-albums/types";

interface ArtistSelectProps {
  artistsData: User[];
  field: ControllerRenderProps<FormValues, "coAritstIds">;
}

const ArtistSelect = ({ artistsData, field }: ArtistSelectProps) => {
  const options = artistsData.map((artist) => ({
    value: artist.id,
    label: artist.artistName,
  }));

  const handleChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
    if (selectedOption) {
      field.onChange([...(field.value || []), selectedOption.value]);
    } else {
      field.onChange([]);
    }
  };

  const selectedValue = options.find((option) => field.value?.includes(option.value));

  return (
    <Select
      options={options}
      value={selectedValue}
      onChange={handleChange}
      placeholder="Select co-artists (optional)"
      className=""
      classNamePrefix="select"
    />
  );
};

export default ArtistSelect;
