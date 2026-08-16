/** @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useHistory } from "../../../src/ui/useHistory";

describe("useHistory", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toEqual([]);
  });

  it("addEntry prepends newest-first", () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.addEntry("12 + 7", "19"));
    act(() => result.current.addEntry("6 * 7", "42"));
    expect(result.current.entries.map((e) => e.result)).toEqual(["42", "19"]);
  });

  it("caps the list at 20 entries, dropping the oldest", () => {
    const { result } = renderHook(() => useHistory());
    for (let i = 0; i < 21; i++) {
      act(() => result.current.addEntry(`${i} + 0`, String(i)));
    }
    expect(result.current.entries).toHaveLength(20);
    expect(result.current.entries[0].result).toBe("20");
    expect(result.current.entries[19].result).toBe("1");
    expect(result.current.entries.some((e) => e.result === "0")).toBe(false);
  });

  it("clear empties the list", () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.addEntry("1 + 1", "2"));
    act(() => result.current.clear());
    expect(result.current.entries).toEqual([]);
  });

  it("clear is a safe no-op when already empty", () => {
    const { result } = renderHook(() => useHistory());
    expect(() => act(() => result.current.clear())).not.toThrow();
    expect(result.current.entries).toEqual([]);
  });

  it("a fresh instance always starts empty, regardless of any prior hook instance", () => {
    const first = renderHook(() => useHistory());
    act(() => first.result.current.addEntry("1 + 1", "2"));
    expect(first.result.current.entries).toHaveLength(1);

    const second = renderHook(() => useHistory());
    expect(second.result.current.entries).toEqual([]);
  });
});
