import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { ChevronDown, Check } from "lucide-react";

const STATUS_VARIANT_MAP = {
  Pending: "warning",
  Completed: "success",
  Cancelled: "danger",
  Review: "purple",
  Active: "info",
};

const DEFAULT_OPTIONS = [
  { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Review", value: "Review" },
  { label: "Active", value: "Active" },
];

const MENU_WIDTH = 180;
const MENU_GAP = 6;
const VIEWPORT_GAP = 8;

export default function StatusBadge({
  value,
  children,
  variant,
  mode = "view",
  options = DEFAULT_OPTIONS,
  onChange,
  width = "110px",
  disabled = false,
}) {
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({
    top: 0,
    left: 0,
    width: MENU_WIDTH,
  });

  const displayValue = value ?? children ?? "";
  const currentVariant =
    variant || STATUS_VARIANT_MAP[displayValue] || "warning";

  const updateMenuPosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = MENU_WIDTH;

    let left = rect.right - menuWidth;
    let top = rect.bottom + MENU_GAP;

    if (left < VIEWPORT_GAP) {
      left = VIEWPORT_GAP;
    }

    if (left + menuWidth > window.innerWidth - VIEWPORT_GAP) {
      left = window.innerWidth - menuWidth - VIEWPORT_GAP;
    }

    const estimatedMenuHeight = Math.max(options.length * 38 + 12, 80);
    if (top + estimatedMenuHeight > window.innerHeight - VIEWPORT_GAP) {
      top = rect.top - estimatedMenuHeight - MENU_GAP;
      if (top < VIEWPORT_GAP) {
        top = VIEWPORT_GAP;
      }
    }

    setMenuStyle({
      top,
      left,
      width: menuWidth,
    });
  };

  useEffect(() => {
    if (!open) return;

    updateMenuPosition();

    const handleOutsideClick = (event) => {
      const target = event.target;

      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;

      setOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handleReposition = () => {
      updateMenuPosition();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, options.length]);

  const handleSelect = (nextValue) => {
    onChange?.(nextValue);
    setOpen(false);
  };

  const handleToggle = (event) => {
    event.stopPropagation();
    if (disabled) return;

    if (!open) {
      updateMenuPosition();
    }
    setOpen((prev) => !prev);
  };

  if (mode === "select") {
    return (
      <>
        <DropdownRoot ref={rootRef} $width={width}>
          <TriggerButton
            ref={triggerRef}
            type="button"
            $variant={currentVariant}
            disabled={disabled}
            onClick={handleToggle}
          >
            <TriggerText>{displayValue}</TriggerText>

            <TriggerIcon $open={open}>
              <ChevronDown size={14} />
            </TriggerIcon>
          </TriggerButton>
        </DropdownRoot>

        {open &&
          createPortal(
            <PortalMenu
              ref={menuRef}
              style={{
                top: `${menuStyle.top}px`,
                left: `${menuStyle.left}px`,
                width: `${menuStyle.width}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {options.map((option) => {
                const optionVariant =
                  STATUS_VARIANT_MAP[option.value] || "warning";
                const isSelected = option.value === displayValue;

                return (
                  <MenuItem
                    key={option.value}
                    type="button"
                    $selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                  >
                    <ItemLeft>
                      <ColorDot $variant={optionVariant} />
                      <ItemLabel>{option.label}</ItemLabel>
                    </ItemLeft>

                    {isSelected && (
                      <SelectedIcon>
                        <Check size={14} />
                      </SelectedIcon>
                    )}
                  </MenuItem>
                );
              })}
            </PortalMenu>,
            document.body,
          )}
      </>
    );
  }

  return (
    <Badge $variant={currentVariant} $width={width}>
      {displayValue}
    </Badge>
  );
}

const getVariantStyle = ($variant) => {
  switch ($variant) {
    case "success":
      return `
        background: #ecfdf3;
        color: #16a34a;
      `;
    case "danger":
      return `
        background: #fef2f2;
        color: #dc2626;
      `;
    case "purple":
      return `
        background: #f3e8ff;
        color: #7c3aed;
      `;
    case "info":
      return `
        background: #eff6ff;
        color: #2563eb;
      `;
    case "warning":
    default:
      return `
        background: #fff7e6;
        color: #d97706;
      `;
  }
};

const getDotColor = ($variant) => {
  switch ($variant) {
    case "success":
      return "#16a34a";
    case "danger":
      return "#dc2626";
    case "purple":
      return "#7c3aed";
    case "info":
      return "#2563eb";
    case "warning":
    default:
      return "#d97706";
  }
};

const Badge = styled.span`
  min-width: ${({ $width }) => $width};
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  ${({ $variant }) => getVariantStyle($variant)}
`;

const DropdownRoot = styled.div`
  position: relative;
  width: ${({ $width }) => $width};
`;

const TriggerButton = styled.button`
  width: 100%;
  height: 28px;
  border: none;
  outline: none;
  border-radius: 999px;
  padding: 0 30px 0 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  transition: box-shadow 0.15s ease;
  ${({ $variant }) => getVariantStyle($variant)}

  &:disabled {
    opacity: 0.7;
  }

  &:not(:disabled):hover {
    box-shadow: 0 0 0 1px rgba(17, 24, 39, 0.06) inset;
  }
`;

const TriggerText = styled.span`
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
`;

const TriggerIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%)
    rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.18s ease;
`;

const PortalMenu = styled.div`
  position: fixed;
  z-index: 9999;
  box-sizing: border-box;
  padding: 6px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
`;

const MenuItem = styled.button`
  position: relative;
  width: 100%;
  min-height: 34px;
  padding: 0 30px 0 10px;
  border: none;
  border-radius: 8px;
  background: ${({ $selected }) => ($selected ? "#f8fafc" : "transparent")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: background 0.15s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const ItemLeft = styled.span`
  width: 100%;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const ColorDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex-shrink: 0;
  background: ${({ $variant }) => getDotColor($variant)};
`;

const ItemLabel = styled.span`
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  text-align: left;
`;

const SelectedIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
`;
