export class Feature {
  public static readonly ImageUpload = new Feature(
    "Image Upload",
    "Upload images to your account."
  );

  public static readonly CreateNotes = new Feature(
    "Create Notes",
    "Create notes and store them in your account."
  );

  public static readonly AICompose = new Feature(
    "AI Compose",
    "Compose notes using AI."
  );

  constructor(
    public name: string,
    public description: string
  ) {}
}
