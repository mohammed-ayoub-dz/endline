"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HugeiconsIcon } from "@hugeicons/react";
import { Pen, Save, RotateCcw } from "@hugeicons/core-free-icons";
import { getNotes, saveNote, deleteNote } from "@/lib/pomodoroDB";

interface NotesProps {
  onMessage?: (msg: { type: "success" | "info" | "warning" | "error"; text: string }) => void;
}

export function Notes({ onMessage }: NotesProps) {
  const [notes, setNotes] = useState<{ id: number; content: string; createdAt: string }[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    getNotes().then(setNotes);
  }, []);

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    await saveNote(newNote);
    const updated = await getNotes();
    setNotes(updated);
    setNewNote("");
    onMessage?.({ type: "success", text: "تم حفظ الملاحظة" });
  };

  const handleDeleteNote = async (id: number) => {
    await deleteNote(id);
    const updated = await getNotes();
    setNotes(updated);
    onMessage?.({ type: "info", text: "تم حذف الملاحظة" });
  };

  return (
    <div className=" backdrop-blur-md rounded-3xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <HugeiconsIcon icon={Pen} className="h-5 w-5" />
        ملاحظاتي
      </h3>
      <div className="space-y-3 mb-4">
        <Textarea
          placeholder="اكتب ملاحظتك هنا..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="bg-black/30"
        />
        <Button onClick={handleSaveNote} className="w-full gap-2">
          <HugeiconsIcon icon={Save} />
          حفظ الملاحظة
        </Button>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {notes.length === 0 && <p className="text-center text-muted-foreground">لا توجد ملاحظات بعد</p>}
        {notes.map((note) => (
          <div key={note.id} className="bg-black/30 rounded-xl p-3 flex justify-between items-start gap-2">
            <div className="flex-1">
              <p className="text-sm">{note.content}</p>
              <span className="text-xs text-muted-foreground">
                {new Date(note.createdAt).toLocaleString("ar-EG")}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)}>
              <HugeiconsIcon icon={RotateCcw} className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}