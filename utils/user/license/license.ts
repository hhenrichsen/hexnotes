import { Feature } from "./feature";

export class License {
  static readonly Free = new License(0, "Free", "", [], 100);
  static readonly Plus = new License(
    1,
    "Plus",
    "prod_RE3P8Fr7GTQMep",
    [(Feature.ImageUpload, Feature.CreateNotes)],
    10000
  );

  static readonly ById = {
    [License.Free.id]: License.Free,
    [License.Plus.id]: License.Plus,
  };

  static readonly ByProductId = {
    [License.Plus.productId]: License.Plus,
  };

  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly productId: string,
    public readonly features: Feature[],
    public readonly storage: number
  ) {}
}
