import { cleanup, render } from "@testing-library/react";
import type { ReactNode } from "react";

export async function runTest<C extends ReactNode>(
  component: C,
  test: () => void | Promise<void>
) {
  render(component);

  await test();

  cleanup();
}
