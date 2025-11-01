import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface Hobby {
  id?: string;
  hobby_name: string;
  description?: string;
  display_order?: number;
}

interface HobbiesFormProps {
  hobbies: Hobby[];
}

export function HobbiesForm({ hobbies }: HobbiesFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Hobby>();

  const onSubmit = async (data: Hobby) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (editingId) {
        const { error } = await supabase
          .from("hobbies")
          .update(data)
          .eq("id", editingId)
          .eq("user_id", user.id);

        if (error) throw error;
        toast({ title: "Hobby updated successfully" });
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from("hobbies")
          .insert({
            user_id: user.id,
            ...data,
            display_order: hobbies.length,
          });

        if (error) throw error;
        toast({ title: "Hobby added successfully" });
      }

      reset();
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["studentHobbies"] });
    } catch (error: any) {
      toast({
        title: "Error saving hobby",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (hobby: Hobby) => {
    setEditingId(hobby.id!);
    reset(hobby);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("hobbies")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Hobby deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["studentHobbies"] });
    } catch (error: any) {
      toast({
        title: "Error deleting hobby",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Hobbies & Interests</CardTitle>
            <CardDescription>
              Optional: Add your hobbies and personal interests
            </CardDescription>
          </div>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Hobby
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing hobbies */}
        {hobbies.map((hobby) => (
          <div key={hobby.id} className="p-4 border rounded-lg space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold">{hobby.hobby_name}</h4>
                {hobby.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {hobby.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(hobby)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(hobby.id!)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Add/Edit form */}
        {isAdding && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">
                {editingId ? "Edit Hobby" : "Add New Hobby"}
              </h4>
              <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hobby_name">Hobby or Interest *</Label>
                <Input
                  id="hobby_name"
                  {...register("hobby_name", { required: "Hobby name is required" })}
                  placeholder="e.g., Photography, Chess, Blogging"
                />
                {errors.hobby_name && (
                  <p className="text-sm text-destructive">{errors.hobby_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Brief description"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? "Update Hobby" : "Add Hobby"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
