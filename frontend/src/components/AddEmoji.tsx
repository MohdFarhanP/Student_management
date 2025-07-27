import EmojiPicker from "emoji-picker-react";
import { Theme } from 'emoji-picker-react';

interface AddEmojiProps {
  showEmojiPicker: boolean;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

const AddEmoji = ({showEmojiPicker, setContent}:AddEmojiProps) => {
  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setContent((prev) => prev + emojiData.emoji);
  }

  return (
    <>
      {showEmojiPicker && <div>
        <EmojiPicker 
          onEmojiClick={(emojiData)=> handleEmojiClick(emojiData)}
          searchDisabled={true}
          theme={Theme.DARK}
          skinTonesDisabled={true}/>
      </div>}
    </>
  )
}

export default AddEmoji
