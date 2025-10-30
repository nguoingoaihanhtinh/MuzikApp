import React from "react";
import Select, { SingleValue } from "react-select";
import { Genre } from "@/types/global";
import { ControllerRenderProps } from "react-hook-form";

/**
 * Use a permissive field type so this select can be reused across forms
 * with slightly different FormValues shapes (upload-albums vs upload-songs).
 */
interface GenreSelectProps {
  genresData: Genre[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, "genreIds">;
}

const GenreSelect = ({ genresData, field }: GenreSelectProps) => {
  const options = genresData.map((genre) => ({
    value: genre.id,
    label: genre.genreName,
  }));

  const handleChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
    const current = Array.isArray(field.value) ? field.value : [];
    if (selectedOption) {
      field.onChange([...current, selectedOption.value]);
    } else {
      field.onChange([]);
    }
  };

  const selectedValue = options.find((option) =>
    Array.isArray(field.value) ? field.value.includes(option.value) : false
  );

  return (
    <Select
      options={options}
      value={selectedValue}
      onChange={handleChange}
      placeholder="Search and select a genre..."
      className=""
      classNamePrefix="select"
    />
  );
};

export default GenreSelect;
