"use client";

import React, { useState } from "react";
import Modal from "./Modal";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "./ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { createPlaylist } from "@/actions/playlist-actions";

interface AddPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPlaylistModal: React.FC<AddPlaylistModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onChange={onClose} title="CREATE PLAYLIST">
      <CreateNewPlaylistForm />
    </Modal>
  );
};

export function CreateNewPlaylistForm() {
  const [formData, setFormData] = useState({
    playlistName: "",
    description: "",
    playlistImageUrl: "",
    backgroundImageUrl: "",
  });

  const [errors, setErrors] = useState({
    playlistName: "",
    description: "",
    playlistImageUrl: "",
    backgroundImageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      playlistName: "",
      description: "",
      playlistImageUrl: "",
      backgroundImageUrl: "",
    };

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    try {
      console.log("Submitting Playlist:", formData);
      await createPlaylist({
        playlistName: formData.playlistName,
        description: formData.description,
        playlistImageUrl: formData.playlistImageUrl,
        backgroundImageUrl: formData.backgroundImageUrl,
      });
      setFormData({
        playlistName: "",
        description: "",
        playlistImageUrl: "",
        backgroundImageUrl: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors((prev) => ({
        ...prev,
        playlistName: "Failed to create playlist. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-2">
      <form className="flex flex-col w-full space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="playlistName" className="text-white">
            Playlist Title
          </Label>
          <Input
            id="playlistName"
            placeholder="Please enter playlist title"
            className="bg-white text-black"
            value={formData.playlistName}
            onChange={handleChange}
          />
          {errors.playlistName && <p className="text-red-500 text-sm mt-1">{errors.playlistName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Description"
            className="bg-white text-black min-h-[120px]"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="playlistImageUrl" className="text-white">
            Playlist Image URL
          </Label>
          <Input
            id="playlistImageUrl"
            placeholder="Enter image URL"
            className="bg-white text-black"
            value={formData.playlistImageUrl}
            onChange={handleChange}
          />
          {errors.playlistImageUrl && <p className="text-red-500 text-sm mt-1">{errors.playlistImageUrl}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="backgroundImageUrl" className="text-white">
            Background Image URL
          </Label>
          <Input
            id="backgroundImageUrl"
            placeholder="Enter background image URL"
            className="bg-white text-black"
            value={formData.backgroundImageUrl}
            onChange={handleChange}
          />
          {errors.backgroundImageUrl && <p className="text-red-500 text-sm mt-1">{errors.backgroundImageUrl}</p>}
        </div>

        <div className="bg-red flex w-full justify-center">
          <Button
            type="submit"
            className="w-[300px] bg-[#E325B6] hover:bg-[#C920A0] text-white rounded-full py-6 text-lg font-medium"
          >
            {loading ? "Adding..." : "Add Playlist"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddPlaylistModal;
