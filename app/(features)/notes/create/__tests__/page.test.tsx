import { describe, it, expect, vi } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import Page from "../page";
import { runTest } from "@/utils/testing/setup";

const redirects = [];

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn((a) => {
        redirects.push(a);
      }),
    })),
  };
});

function expectInstanceOf<R>(
  element: unknown,
  ctor: new () => R
): asserts element is R {
  expect(element).toBeInstanceOf(ctor);
}

describe(import.meta.name, () => {
  it("should work", () => {
    runTest(<Page />, async () => {
      const titleInput = screen.getByTestId("title-input");

      expectInstanceOf(titleInput, HTMLInputElement);
      expect(titleInput.placeholder).equals("A Note");
    });
  });

  it("should also work", () => {
    runTest(<Page />, async () => {
      const titleInput = screen.getByTestId("title-input");
      expect(titleInput).not.toBeNull();
    });
  });
});
