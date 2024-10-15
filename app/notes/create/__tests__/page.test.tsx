import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Page from "../page";

describe(module.id, () => {
  const setup = () => {
    vi.mock("next/navigation", async () => {
      const actual = await vi.importActual("next/navigation");
      return {
        ...actual,
        useRouter: vi.fn(() => ({
          push: vi.fn(),
          replace: vi.fn(),
        })),
      };
    });

    const utils = render(<Page />);

    const titleLabel = screen.getByTestId("title-label");
    const titleInput = screen.getByTestId("title-input");
    const contentLabel = screen.getByTestId("content-label");
    const contentInput = screen.getByTestId("content-input");
    const submitButton = screen.getByTestId("submit-button");

    return {
      titleLabel,
      titleInput,
      contentLabel,
      contentInput,
      submitButton,
      utils,
    };
  };

  it("Should Render", () => {
    const { titleLabel, titleInput, contentLabel, contentInput, submitButton } =
      setup();
    expect(titleLabel).toBeTruthy();
    expect(titleInput).toBeTruthy();
    expect(contentLabel).toBeTruthy();
    expect(contentInput).toBeTruthy();
    expect(submitButton).toBeTruthy();

    cleanup();
  });

  it("Should not accept titles less than 2 characters", async () => {
    const { titleInput, submitButton } = setup();

    fireEvent.change(titleInput, { target: { value: "a" } });

    fireEvent.click(submitButton);

    const message = await screen.findByTestId("title-message");
    expect(message).toBeTruthy();
    expect(message.textContent).toBe(
      "String must contain at least 2 character(s)"
    );

    cleanup();
  });
});
