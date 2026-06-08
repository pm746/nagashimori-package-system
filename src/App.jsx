import React, { useEffect, useMemo, useState } from "react";
import { Check, Plus, Minus } from "lucide-react";
import html2pdf from "html2pdf.js";
import { proposal } from "./proposalData";

const RED = "#ED3237";
const FORM_NAME = proposal.formName || "proposta-simplexa";

const SIMPLEXA_CONTACT = {
  email: "contato@simplexa.com.br",
  instagram: "@simplexa",
  instagramUrl: "https://instagram.com/simplexa",
  website: "simplexa.com.br",
  websiteUrl: "https://simplexa.com.br",
  whatsapp: [
    {
      label: "PM FERRONY",
      phone: "55 99901-4361",
      url: "https://wa.me/5555999014361",
    },
    {
      label: "ROGÉRIO LOBO",
      phone: "55 98115-0877",
      url: "https://wa.me/5555981150877",
    },
  ],
};


const noneOption = {
  key: "none",
  label: "Não incluir",
  value: 0,
  description: "Bloco não incluído nesta configuração.",
  includes: [],
};

const currency = (value) =>
  value === 0
    ? "Incluso"
    : new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(value);

const percent = (value) => {
  const numeric = Number(value || 0) * 100;
  return `${Number.isInteger(numeric) ? numeric : numeric.toFixed(1)}%`;
};

const slugify = (text) =>
  String(text || "proposta")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const getAvailableModes = (block) => {
  const modes = [];

  if (block?.standard) {
    modes.push({
      key: "standard",
      ...block.standard,
    });
  }

  if (block?.expanded) {
    modes.push({
      key: "expanded",
      ...block.expanded,
    });
  }

  return modes;
};

const getCalculatorOptions = (block) => [noneOption, ...getAvailableModes(block)];

const getDefaultMode = (block) => {
  if (block?.standard) return "standard";
  if (block?.expanded) return "expanded";
  return "none";
};

const getOption = (block, mode) => {
  if (mode === "none") return noneOption;

  const options = getAvailableModes(block);
  const found = options.find((option) => option.key === mode);

  if (found) return found;

  const fallbackMode = getDefaultMode(block);
  return options.find((option) => option.key === fallbackMode) || noneOption;
};

const getOptionLabel = (block, modeOrOption) => {
  const option =
    typeof modeOrOption === "string" ? getOption(block, modeOrOption) : modeOrOption;

  if (option.key === "none") return "Não incluir";

  const availableModes = getAvailableModes(block);

  if (availableModes.length === 1 && option.label === "Padrão") {
    return "Incluir";
  }

  return option.label;
};

const buildPaymentOptions = (payment, total) => {
  const rawOptions =
    Array.isArray(payment?.options) && payment.options.length
      ? payment.options
      : [
          {
            label: payment?.installmentLabel || "Condição de pagamento",
            discount: payment?.cashDiscount || 0,
            entryPercent: payment?.entryPercent || 0,
            installmentsCount: payment?.installmentsCount || 0,
          },
        ];

  return rawOptions.map((option, index) => {
    const discount = Number(option.discount || 0);
    const entryPercent = Number(option.entryPercent || 0);
    const installmentsCount = Number(option.installmentsCount || 0);
    const discountedTotal = total * (1 - discount);
    const entry = discountedTotal * entryPercent;
    const balance = discountedTotal - entry;
    const installment = installmentsCount ? balance / installmentsCount : 0;
    const equalInstallments =
      entryPercent > 0 &&
      installmentsCount > 0 &&
      Math.abs(entry - installment) < 0.01;

    return {
      id: option.id || `payment-${index}`,
      label: option.label || `Condição ${index + 1}`,
      description: option.description || "",
      discount,
      entryPercent,
      installmentsCount,
      total: discountedTotal,
      entry,
      balance,
      installment,
      equalInstallments,
    };
  });
};

function OptionBadge({ active, children }) {
  return (
    <span
      className={`inline-flex items-center gap-2 border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-white"
          : "border-neutral-300 bg-white text-neutral-500"
      }`}
    >
      {active ? <Check size={13} /> : null}
      {children}
    </span>
  );
}

function ScopeAccordion({ block, open, onToggle }) {
  const availableModes = getAvailableModes(block);

  return (
    <div className="border-t border-neutral-300 bg-white">
      <button
        onClick={onToggle}
        className="grid w-full grid-cols-[74px_1fr_40px] items-center gap-4 px-0 py-5 text-left md:grid-cols-[110px_1fr_40px]"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Bloco {block.id}
        </span>

        <div>
          <h3 className="text-xl font-semibold tracking-tight text-neutral-950">
            {block.title}
          </h3>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral-600">
            {block.note}
          </p>
        </div>

        <span className="flex h-9 w-9 items-center justify-center border border-neutral-300 text-neutral-800">
          {open ? <Minus size={17} /> : <Plus size={17} />}
        </span>
      </button>

      {open ? (
        <div
          className={`grid gap-4 pb-6 ${
            availableModes.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"
          }`}
        >
          {availableModes.map((option) => (
            <div
              key={option.key}
              className="border border-neutral-300 bg-neutral-50 p-5"
            >
              <div className="mb-4">
                <OptionBadge
                  active={option.key === "expanded" || availableModes.length === 1}
                >
                  {getOptionLabel(block, option)}
                </OptionBadge>

                <p className="mt-3 text-sm font-medium leading-6 text-neutral-900">
                  {option.description}
                </p>
              </div>

              <ul className="space-y-2 text-sm leading-6 text-neutral-700">
                {(option.includes || []).map((item, index) => (
                  <li key={index} className="grid grid-cols-[14px_1fr] gap-2">
                    <span className="mt-[11px] h-[3px] w-[8px] bg-[var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CalculatorRow({ block, value, onChange }) {
  const options = getCalculatorOptions(block);
  const safeValue = options.some((option) => option.key === value)
    ? value
    : getDefaultMode(block);
  const current = getOption(block, safeValue);

  return (
    <div className="grid gap-4 border-t border-neutral-300 py-4 md:grid-cols-[1fr_310px_150px] md:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Bloco {block.id}
        </p>

        <h4 className="mt-1 text-base font-semibold text-neutral-950">
          {block.title}
        </h4>

        <p className="mt-1 text-sm leading-5 text-neutral-600">
          {current.description}
        </p>
      </div>

      <div
        className={`grid grid-cols-1 border border-neutral-300 bg-white ${
          options.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        {options.map((option, index) => {
          const selected = safeValue === option.key;
          const isLast = index === options.length - 1;

          return (
            <button
              key={option.key}
              onClick={() => onChange(block.key, option.key)}
              className={`px-4 py-3 text-left text-sm font-semibold leading-5 transition ${
                selected
                  ? "bg-[var(--accent)] text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-100"
              } ${
                !isLast
                  ? "border-b border-neutral-300 sm:border-b-0 sm:border-r"
                  : ""
              }`}
            >
              {getOptionLabel(block, option)}

              <span className="block whitespace-nowrap text-xs font-medium opacity-80">
                {currency(option.value)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="text-left md:text-right">
        <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
          Selecionado
        </p>

        <p className="mt-1 text-lg font-semibold text-neutral-950">
          {currency(current.value)}
        </p>
      </div>
    </div>
  );
}

function PaymentOptionCard({ option, index }) {
  return (
    <div className="border border-neutral-300 bg-neutral-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Condição {index + 1}
      </p>

      <p className="mt-1 text-base font-semibold text-neutral-950">
        {option.label}
      </p>

      {option.description ? (
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          {option.description}
        </p>
      ) : null}

      <div className="mt-4 space-y-2 text-sm leading-6 text-neutral-700">
        <p>
          <span className="font-semibold text-neutral-950">
            Total{option.discount > 0 ? ` com ${percent(option.discount)} de desconto` : ""}:
          </span>{" "}
          {currency(option.total)}
        </p>

        {option.equalInstallments ? (
          <p>
            <span className="font-semibold text-neutral-950">
              {option.installmentsCount + 1} parcelas iguais:
            </span>{" "}
            {option.installmentsCount + 1}x de {currency(option.entry)}
          </p>
        ) : (
          <>
            {option.entryPercent > 0 ? (
              <p>
                <span className="font-semibold text-neutral-950">
                  Entrada {percent(option.entryPercent)}:
                </span>{" "}
                {currency(option.entry)}
              </p>
            ) : null}

            {option.installmentsCount > 0 ? (
              <p>
                <span className="font-semibold text-neutral-950">
                  Saldo em {option.installmentsCount}x:
                </span>{" "}
                {option.installmentsCount}x de {currency(option.installment)}
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function SummaryBlock({ item, open, onToggle }) {
  const isNone = item.mode === "none";

  const detail = (
    <div className="border-t border-neutral-300 bg-white p-4">
      <p className="text-sm leading-6 text-neutral-700">{item.description}</p>

      {!isNone && item.includes?.length ? (
        <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700">
          {item.includes.map((include, index) => (
            <li key={index} className="grid grid-cols-[14px_1fr] gap-2">
              <span className="mt-[11px] h-[3px] w-[8px] bg-[var(--accent)]" />
              <span>{include}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  return (
    <div className="border border-neutral-300 bg-neutral-50">
      <button
        type="button"
        onClick={onToggle}
        className="grid w-full gap-3 p-4 text-left md:grid-cols-[90px_1fr_150px_36px] md:items-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Bloco {item.id}
        </p>

        <div>
          <p className="font-semibold text-neutral-950">{item.title}</p>
          <p className="mt-1 text-sm leading-6 text-neutral-600">
            Selecionado: {item.label}
          </p>
        </div>

        <p className="font-semibold md:text-right">{currency(item.value)}</p>

        <span className="flex h-8 w-8 items-center justify-center border border-neutral-300 text-neutral-800 pdf-skip">
          {open ? <Minus size={15} /> : <Plus size={15} />}
        </span>
      </button>

      <div className={`${open ? "block" : "hidden"} pdf-skip`}>{detail}</div>

      <div className="hidden pdf-force-block">{detail}</div>
    </div>
  );
}

export default function ProposalConfigurator() {
  const blocks = proposal.blocks || [];
  const nav = proposal.nav || [];
  const sections = proposal.sections || {};
  const payment = proposal.payment || {};
  const contact = SIMPLEXA_CONTACT;
  const assets = proposal.assets || {};

  useEffect(() => {
    document.title = `${proposal.projectName || "Proposta"} · Proposta Comercial`;
  }, []);

  const [openBlocks, setOpenBlocks] = useState([]);
  const [openSummaryBlocks, setOpenSummaryBlocks] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [formStatus, setFormStatus] = useState("idle");
  const [pdfStatus, setPdfStatus] = useState("idle");

  const [contactData, setContactData] = useState({
    nome: "",
    empresa: proposal.projectName || "",
    email: "",
    whatsapp: "",
  });

  const [selection, setSelection] = useState(() =>
    Object.fromEntries(blocks.map((block) => [block.key, getDefaultMode(block)]))
  );

  const selectedBlocks = useMemo(
    () =>
      blocks.map((block) => {
        const selectedMode = selection[block.key] || getDefaultMode(block);
        const options = getCalculatorOptions(block);
        const mode = options.some((option) => option.key === selectedMode)
          ? selectedMode
          : getDefaultMode(block);
        const option = getOption(block, mode);

        return {
          id: block.id,
          key: block.key,
          title: block.title,
          mode,
          label: getOptionLabel(block, option),
          value: option.value,
          description: option.description,
          includes: option.includes || [],
        };
      }),
    [blocks, selection]
  );

  const total = useMemo(
    () => selectedBlocks.reduce((sum, block) => sum + block.value, 0),
    [selectedBlocks]
  );

  const paymentOptions = useMemo(
    () => buildPaymentOptions(payment, total),
    [payment, total]
  );

  const defaultPayment = paymentOptions[0] || {
    label: "Condição de pagamento",
    total,
    entry: 0,
    installment: 0,
    installmentsCount: 0,
    discount: 0,
    entryPercent: 0,
  };

  const canNativeSharePdf =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const hasAnyExpanded = blocks.some((block) =>
    getAvailableModes(block).some((option) => option.key === "expanded")
  );

  const allStandard = blocks.every(
    (block) => selection[block.key] === getDefaultMode(block)
  );

  const allExpanded =
    hasAnyExpanded &&
    blocks.every((block) =>
      block.expanded
        ? selection[block.key] === "expanded"
        : selection[block.key] === getDefaultMode(block)
    );

  const summaryText = useMemo(() => {
    const paymentLines = paymentOptions.flatMap((option, index) => {
      if (option.equalInstallments) {
        return [
          `Condição ${index + 1} — ${option.label}`,
          `Total: ${currency(option.total)}`,
          `${option.installmentsCount + 1} parcelas iguais de ${currency(option.entry)}`,
        ];
      }

      return [
        `Condição ${index + 1} — ${option.label}`,
        `Total${option.discount > 0 ? ` com ${percent(option.discount)} de desconto` : ""}: ${currency(
          option.total
        )}`,
        option.entryPercent > 0
          ? `Entrada ${percent(option.entryPercent)}: ${currency(option.entry)}`
          : null,
        option.installmentsCount > 0
          ? `Saldo em ${option.installmentsCount}x de ${currency(option.installment)}`
          : null,
      ].filter(Boolean);
    });

    const lines = [
      `Resumo da proposta selecionada — ${proposal.projectName}`,
      "",
      `Nome: ${contactData.nome || "Não informado"}`,
      `Empresa: ${contactData.empresa || "Não informado"}`,
      `E-mail: ${contactData.email || "Não informado"}`,
      `WhatsApp: ${contactData.whatsapp || "Não informado"}`,
      "",
      "Blocos selecionados:",
      "",
      ...selectedBlocks.map(
        (item) =>
          `Bloco ${item.id} — ${item.title}\nSelecionado: ${item.label}\nValor: ${currency(
            item.value
          )}\nDescrição: ${item.description}\nInclui:\n${(item.includes || [])
            .map((include) => `- ${include}`)
            .join("\n")}`
      ),
      "",
      `Total selecionado: ${currency(total)}`,
      "",
      "Condições de pagamento:",
      ...paymentLines,
      "",
      "Observações:",
      ...(payment.milestones || []),
    ];

    return lines.join("\n\n");
  }, [contactData, selectedBlocks, total, paymentOptions, payment.milestones]);

  const pdfFilename = `proposta-${slugify(proposal.projectName || "simplexa")}.pdf`;

  const toggleOpen = (id) => {
    setOpenBlocks((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const toggleSummaryOpen = (id) => {
    setOpenSummaryBlocks((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const setAll = (mode) =>
    setSelection(
      Object.fromEntries(
        blocks.map((block) => [
          block.key,
          mode === "expanded" && block.expanded ? "expanded" : getDefaultMode(block),
        ])
      )
    );

  const update = (key, mode) =>
    setSelection((current) => ({ ...current, [key]: mode }));

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContactData((current) => ({ ...current, [name]: value }));

    if (formStatus !== "idle") {
      setFormStatus("idle");
    }
  };

  const preparePdfElement = () => {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      background: #ffffff;
      color: #111111;
      padding: 28px;
      width: 760px;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.45;
      box-sizing: border-box;
    `;

    const addText = (text, style = "") => {
      const element = document.createElement("div");
      element.textContent = text || "";
      element.style.cssText = style;
      wrapper.appendChild(element);
      return element;
    };

    const addList = (items = []) => {
      const ul = document.createElement("ul");
      ul.style.cssText = "margin: 8px 0 0 18px; padding: 0; font-size: 12px; color: #333333;";
      items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        li.style.cssText = "margin: 0 0 4px 0;";
        ul.appendChild(li);
      });
      wrapper.appendChild(ul);
    };

    addText("Proposta selecionada", "font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #ED3237; margin-bottom: 8px;");
    addText(proposal.projectName || "Proposta", "font-size: 34px; font-weight: 700; letter-spacing: -1px; margin-bottom: 10px;");
    addText(sections.summary?.text || "Resumo da proposta selecionada.", "font-size: 13px; color: #555555; margin-bottom: 22px;");

    addText("Total selecionado", "font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #666666; margin-top: 10px;");
    addText(currency(total), "font-size: 30px; font-weight: 700; margin: 2px 0 18px 0;");

    addText("Condições de pagamento", "font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #666666; margin-top: 18px; border-top: 1px solid #dddddd; padding-top: 16px;");

    paymentOptions.forEach((option, index) => {
      addText(`Condição ${index + 1} · ${option.label}`, "font-size: 15px; font-weight: 700; margin-top: 12px;");
      addText(`Total${option.discount > 0 ? ` com ${percent(option.discount)} de desconto` : ""}: ${currency(option.total)}`, "font-size: 13px; color: #333333; margin-top: 3px;");

      if (option.equalInstallments) {
        addText(`${option.installmentsCount + 1} parcelas iguais de ${currency(option.entry)}`, "font-size: 13px; color: #333333; margin-top: 3px;");
      } else {
        if (option.entryPercent > 0) {
          addText(`Entrada ${percent(option.entryPercent)}: ${currency(option.entry)}`, "font-size: 13px; color: #333333; margin-top: 3px;");
        }
        if (option.installmentsCount > 0) {
          addText(`Saldo em ${option.installmentsCount}x de ${currency(option.installment)}`, "font-size: 13px; color: #333333; margin-top: 3px;");
        }
      }
    });

    if (payment.milestones?.length) {
      addText("Observações", "font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #666666; margin-top: 20px;");
      addList(payment.milestones);
    }

    addText("Blocos selecionados", "font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #666666; margin-top: 22px; border-top: 1px solid #dddddd; padding-top: 16px;");

    selectedBlocks.forEach((item) => {
      addText(`Bloco ${item.id} · ${item.title}`, "font-size: 15px; font-weight: 700; margin-top: 14px;");
      addText(`Selecionado: ${item.label} · ${currency(item.value)}`, "font-size: 13px; font-weight: 700; color: #ED3237; margin-top: 3px;");
      addText(item.description, "font-size: 13px; color: #333333; margin-top: 5px;");
      if (item.includes?.length) addList(item.includes);
    });

    addText("Contato", "font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #666666; margin-top: 24px; border-top: 1px solid #dddddd; padding-top: 16px;");
    addText(contact.email || "", "font-size: 13px; color: #333333; margin-top: 4px;");
    addText(contact.website || "", "font-size: 13px; color: #333333; margin-top: 2px;");

    (contact.whatsapp || []).forEach((item) => {
      addText(`${item.label}${item.phone ? ` · ${item.phone}` : ""}`, "font-size: 13px; color: #333333; margin-top: 2px;");
    });

    return wrapper;
  };

  const generatePdfBlob = async () => {
    const wrapper = preparePdfElement();

    return await html2pdf()
      .set({
        margin: 8,
        filename: pdfFilename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(wrapper)
      .outputPdf("blob");
  };

  const generateSummaryPdfBase64 = async () => {
    const wrapper = preparePdfElement();

    const dataUri = await html2pdf()
      .set({
        margin: 8,
        filename: pdfFilename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(wrapper)
      .outputPdf("datauristring");

    return dataUri.split(",")[1];
  };

  const handleDownloadPdf = async () => {
    setPdfStatus("generating");

    try {
      const wrapper = preparePdfElement();

      await html2pdf()
        .set({
          margin: 8,
          filename: pdfFilename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(wrapper)
        .save();

      setPdfStatus("idle");
    } catch (error) {
      console.error(error);
      setPdfStatus("error");
    }
  };

  const handleSharePdf = async () => {
    setPdfStatus("generating");

    try {
      const blob = await generatePdfBlob();
      const file = new File([blob], pdfFilename, {
        type: "application/pdf",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${proposal.projectName || "Proposta"} · Proposta Comercial`,
          text: `Proposta comercial — ${proposal.projectName || ""}`,
          files: [file],
        });

        setPdfStatus("idle");
        return;
      }

      await handleDownloadPdf();
    } catch (error) {
      console.error(error);
      setPdfStatus("error");
    }
  };

  const handleSubmitSummary = async (event) => {
    event.preventDefault();
    setFormStatus("sending");

    try {
      const pdfBase64 = await generateSummaryPdfBase64();

      const response = await fetch("/.netlify/functions/send-proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: contactData.nome,
          empresa: contactData.empresa,
          email: contactData.email,
          whatsapp: contactData.whatsapp,
          resumo: summaryText,
          total: currency(total),
          entrada: currency(defaultPayment.entry),
          parcelas: defaultPayment.equalInstallments
            ? `${defaultPayment.installmentsCount + 1}x de ${currency(defaultPayment.entry)}`
            : `${defaultPayment.installmentsCount}x de ${currency(defaultPayment.installment)}`,
          pdfBase64,
          filename: pdfFilename,
          projectName: proposal.projectName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Erro ao enviar proposta.");
      }

      setFormStatus("success");
    } catch (error) {
      console.error(error);
      setFormStatus("error");
    }
  };

  return (
    <main
      className="min-h-screen bg-neutral-100 text-neutral-950"
      style={{
        "--accent": RED,
        fontFamily: "var(--font-brand, Borna, Inter, Arial, sans-serif)",
      }}
    >
      <style>{`
        @font-face {
          font-family: 'Borna';
          src: url('/fonts/Borna-Regular.otf') format('opentype');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: 'Borna';
          src: url('/fonts/Borna-Medium.otf') format('opentype');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: 'Borna';
          src: url('/fonts/Borna-SemiBold.otf') format('opentype');
          font-weight: 600;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: 'Borna';
          src: url('/fonts/Borna-Bold.otf') format('opentype');
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }

        html {
          scroll-behavior: smooth;
        }

        .brand-font {
          font-family: var(--font-brand, 'Borna', Inter, Arial, sans-serif);
        }
      `}</style>

      <section className="border-b border-neutral-300 bg-white no-print">
        <div className="mx-auto max-w-6xl px-5 pt-8 md:px-8 md:pt-10">
          <div className="overflow-hidden bg-white">
            <picture>
              <source media="(min-width: 768px)" srcSet={assets.headerDesktop} />

              <img
                src={assets.headerMobile}
                alt="Simplexa · proposta comercial"
                className="block h-auto w-full object-contain"
                onError={(event) => {
                  const wrapper = event.currentTarget.closest("div");

                  if (wrapper) {
                    wrapper.innerHTML =
                      '<div style="background:#ED3237;color:white;padding:38px 48px;font-size:34px;font-weight:600;letter-spacing:-0.04em">simplexa</div>';
                  }
                }}
              />
            </picture>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5 py-6 md:px-8">
          <nav className="flex max-h-10 flex-wrap gap-x-3 gap-y-2 overflow-hidden text-[10px] font-semibold uppercase leading-4 tracking-[0.12em] text-neutral-500 md:max-h-none md:gap-4 md:text-xs md:tracking-[0.18em]">
            {nav.map(([href, label]) => (
              <a
                key={href}
                href={`#${href}`}
                className="hover:text-[var(--accent)]"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <header className="bg-white no-print">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1fr_330px] md:px-8 md:py-18 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              {proposal.proposalType}
            </p>

            <h1 className="mt-7 max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-5xl lg:text-6xl">
              {proposal.title}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-neutral-700 md:text-lg">
              {proposal.subtitle}
            </p>
          </div>

          <aside className="border border-neutral-300 bg-neutral-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              {proposal.introCard.label}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-neutral-950">
              {proposal.introCard.title}
            </p>

            <div className="mt-6 h-1 w-24 bg-[var(--accent)]" />

            <p className="mt-6 text-sm leading-6 text-neutral-600">
              {proposal.introCard.text}
            </p>
          </aside>
        </div>
      </header>

      <section
        id={sections.context.id}
        className="border-y border-neutral-300 bg-neutral-50 no-print"
      >
        <div className="mx-auto max-w-6xl px-5 py-14 text-left md:px-8">
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            {sections.context.eyebrow}
          </p>

          <div>
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
              {sections.context.title}
            </h2>

            <div className="mt-8 grid gap-5 text-base leading-8 text-neutral-700">
              {(sections.context.paragraphs || []).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id={sections.diagnostic.id} className="bg-white no-print">
        <div className="mx-auto max-w-6xl px-5 py-14 text-left md:px-8">
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            {sections.diagnostic.eyebrow}
          </p>

          <div>
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
              {sections.diagnostic.title}
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-700">
              {sections.diagnostic.text}
            </p>

            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {(sections.diagnostic.cards || []).map((card) => (
                <div
                  key={card.title}
                  className="border border-neutral-300 bg-neutral-50 p-5"
                >
                  <p className="text-sm font-semibold text-neutral-950">
                    {card.title}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-neutral-700">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>

            {sections.diagnostic.note ? (
              <div className="mt-8 border-l-2 border-[var(--accent)] bg-neutral-50 p-5">
                <p className="text-sm leading-7 text-neutral-700">
                  {sections.diagnostic.note}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section id={sections.scope.id} className="bg-white no-print">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
          <div className="mb-10 text-left">
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
              {sections.scope.eyebrow}
            </p>

            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
                {sections.scope.title}
              </h2>

              <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-700">
                {sections.scope.text}
              </p>
            </div>
          </div>

          <div className="border-b border-neutral-300">
            {blocks.map((block) => (
              <ScopeAccordion
                key={block.id}
                block={block}
                open={openBlocks.includes(block.id)}
                onToggle={() => toggleOpen(block.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id={sections.investment.id}
        className="border-y border-neutral-300 bg-neutral-50"
      >
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
          <div className="mb-10 text-left">
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
              {sections.investment.eyebrow}
            </p>

            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
                {sections.investment.title}
              </h2>

              <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-700">
                {sections.investment.text}
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="border border-neutral-300 bg-white p-5 md:p-7">
              <div className="mb-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                <button
                  onClick={() => setAll("standard")}
                  className={`whitespace-nowrap border px-3 py-3 text-center text-xs font-semibold transition sm:px-4 sm:text-sm ${
                    allStandard
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-neutral-900 bg-white text-neutral-950 hover:bg-neutral-100"
                  }`}
                >
                  <span className="sm:hidden">
                    {sections.investment.standardButtonMobile || "Base"}
                  </span>
                  <span className="hidden sm:inline">
                    {sections.investment.standardButtonDesktop || "Configuração base"}
                  </span>
                </button>

                {hasAnyExpanded ? (
                  <button
                    onClick={() => setAll("expanded")}
                    className={`whitespace-nowrap border px-3 py-3 text-center text-xs font-semibold transition sm:px-4 sm:text-sm ${
                      allExpanded
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : "border-neutral-900 bg-white text-neutral-950 hover:bg-neutral-100"
                    }`}
                  >
                    <span className="sm:hidden">
                      {sections.investment.expandedButtonMobile || "Expandido"}
                    </span>
                    <span className="hidden sm:inline">
                      {sections.investment.expandedButtonDesktop ||
                        "Configuração expandida"}
                    </span>
                  </button>
                ) : null}
              </div>

              {blocks.map((block) => (
                <CalculatorRow
                  key={block.id}
                  block={block}
                  value={selection[block.key]}
                  onChange={update}
                />
              ))}

              <button
                onClick={() => setShowSummary((current) => !current)}
                className="mt-8 w-full border border-[var(--accent)] bg-[var(--accent)] px-5 py-4 text-center text-sm font-semibold uppercase tracking-[0.12em] text-white hover:opacity-90"
              >
                {showSummary
                  ? sections.investment.summaryButtonOpen
                  : sections.investment.summaryButtonClosed}
              </button>
            </div>

            <aside className="border border-neutral-300 bg-white p-6 lg:sticky lg:top-6 lg:self-start">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Total selecionado
              </p>

              <p className="mt-3 text-5xl font-semibold tracking-[-0.04em] text-neutral-950">
                {currency(total)}
              </p>

              <div className="my-6 h-px bg-neutral-300" />

              <div className="space-y-4">
                {paymentOptions.map((option, index) => (
                  <PaymentOptionCard key={option.id} option={option} index={index} />
                ))}
              </div>

              {payment.milestones?.length ? (
                <div className="mt-5 space-y-1 text-sm text-neutral-600">
                  {payment.milestones.map((milestone, index) => (
                    <p key={index}>{milestone}</p>
                  ))}
                </div>
              ) : null}
            </aside>
          </div>

          {showSummary ? (
            <section
              id="summary-print"
              className="mt-10 border border-neutral-300 bg-white p-6 md:p-8"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xl font-semibold uppercase tracking-[0.18em] text-[var(--accent)] md:text-2xl">
                    Proposta selecionada
                  </p>

                  <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
                    {proposal.projectName}
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600">
                    {sections.summary.text}
                  </p>
                </div>

                <div className="border border-neutral-300 bg-neutral-50 p-5 md:min-w-[260px]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    {sections.summary.totalLabel}
                  </p>

                  <p className="mt-2 text-3xl font-semibold">
                    {currency(total)}
                  </p>

                  <div className="mt-4 space-y-3">
                    {paymentOptions.map((option, index) => (
                      <PaymentOptionCard key={option.id} option={option} index={index} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                {selectedBlocks.map((item) => (
                  <SummaryBlock
                    key={item.key}
                    item={item}
                    open={openSummaryBlocks.includes(item.key)}
                    onToggle={() => toggleSummaryOpen(item.key)}
                  />
                ))}
              </div>

              <div className="mt-8 grid gap-6 border-t border-neutral-300 pt-8 md:grid-cols-2">
                <form
                  name={FORM_NAME}
                  method="POST"
                  data-netlify="true"
                  onSubmit={handleSubmitSummary}
                  className="grid gap-4 pdf-skip"
                >
                  <input type="hidden" name="form-name" value={FORM_NAME} />
                  <input type="hidden" name="resumo" value={summaryText} />
                  <input type="hidden" name="total" value={currency(total)} />

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Nome
                    </label>

                    <input
                      name="nome"
                      value={contactData.nome}
                      onChange={handleContactChange}
                      className="mt-2 w-full border border-neutral-300 bg-white px-4 py-3 text-sm"
                      placeholder="Nome do responsável"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Empresa
                    </label>

                    <input
                      name="empresa"
                      value={contactData.empresa}
                      onChange={handleContactChange}
                      className="mt-2 w-full border border-neutral-300 bg-white px-4 py-3 text-sm"
                      placeholder="Empresa"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      E-mail
                    </label>

                    <input
                      name="email"
                      type="email"
                      value={contactData.email}
                      onChange={handleContactChange}
                      className="mt-2 w-full border border-neutral-300 bg-white px-4 py-3 text-sm"
                      placeholder="email@empresa.com.br"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      WhatsApp
                    </label>

                    <input
                      name="whatsapp"
                      value={contactData.whatsapp}
                      onChange={handleContactChange}
                      className="mt-2 w-full border border-neutral-300 bg-white px-4 py-3 text-sm"
                      placeholder="(55) 99999-9999"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === "sending"}
                    className="mt-2 border border-[var(--accent)] bg-[var(--accent)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {formStatus === "sending"
                      ? sections.summary.sendingButton
                      : sections.summary.sendButton}
                  </button>

                  {formStatus === "success" ? (
                    <p className="text-sm font-semibold text-neutral-950">
                      {sections.summary.successMessage}
                    </p>
                  ) : null}

                  {formStatus === "error" ? (
                    <p className="text-sm font-semibold text-[var(--accent)]">
                      {sections.summary.errorMessage}
                    </p>
                  ) : null}
                </form>

                <div className="grid content-start gap-4 pdf-skip">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={pdfStatus === "generating"}
                    className="border border-neutral-900 bg-white px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-950 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pdfStatus === "generating"
                      ? "Gerando PDF..."
                      : sections.summary.downloadPdfButton || "Baixar PDF"}
                  </button>

                  {canNativeSharePdf ? (
                    <button
                      type="button"
                      onClick={handleSharePdf}
                      disabled={pdfStatus === "generating"}
                      className="border border-[var(--accent)] bg-[var(--accent)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sections.summary.sharePdfButton || "Compartilhar PDF"}
                    </button>
                  ) : null}

                  {pdfStatus === "error" ? (
                    <p className="text-sm font-semibold text-[var(--accent)]">
                      Não foi possível gerar o PDF agora. Tente baixar novamente.
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <section id={sections.timeline.id} className="bg-white no-print">
        <div className="mx-auto max-w-6xl px-5 py-14 text-left md:px-8">
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            {sections.timeline.eyebrow}
          </p>

          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              {sections.timeline.title}
            </h2>

            <div className="mt-8 flex flex-col gap-3">
              {(sections.timeline.items || []).map((item) => (
                <div
                  key={item.period}
                  className="border border-neutral-300 bg-neutral-50 p-5"
                >
                  <p className="text-sm font-semibold text-[var(--accent)]">
                    {item.period}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-neutral-700">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id={sections.exclusions.id}
        className="border-t border-neutral-300 bg-neutral-50 no-print"
      >
        <div className="mx-auto max-w-6xl px-5 py-14 text-left md:px-8">
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            {sections.exclusions.eyebrow}
          </p>

          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              {sections.exclusions.title}
            </h2>

            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {(sections.exclusions.items || []).map((item) => (
                <div
                  key={item}
                  className="border-l-2 border-[var(--accent)] bg-white p-4 text-sm leading-6 text-neutral-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id={sections.closing.id}
        className="border-t border-neutral-300 bg-white no-print"
      >
        <div className="mx-auto max-w-6xl px-5 py-14 text-left md:px-8">
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            {sections.closing.eyebrow}
          </p>

          <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
                {sections.closing.title}
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-neutral-700">
                {sections.closing.text}
              </p>
            </div>

            <div className="border border-neutral-300 bg-neutral-50 p-6">
              <p className="text-sm font-semibold text-neutral-950">
                {sections.closing.flowTitle}
              </p>

              <div className="mt-5 space-y-4 text-sm leading-6 text-neutral-700">
                {(sections.closing.flow || []).map((item, index) => (
                  <div
                    key={item}
                    className="border-l-2 border-[var(--accent)] pl-4"
                  >
                    {index + 1}. {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-300 bg-white no-print">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
          <div className="grid gap-12 md:grid-cols-[280px_1fr] md:items-center lg:gap-20">
            <div>
              <img
                src={assets.simplexaLogo}
                alt="Simplexa"
                className="h-auto w-[280px] max-w-full object-contain"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div className="grid gap-12 text-neutral-700 md:grid-cols-[0.72fr_1.45fr] md:items-start lg:gap-20">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
                  Contato
                </p>

                <div className="mt-6 space-y-4 text-xl leading-8 md:text-2xl md:leading-9">
                  <a
                    className="block hover:text-[var(--accent)]"
                    href={`mailto:${contact.email}`}
                  >
                    {contact.email}
                  </a>

                  <a
                    className="block hover:text-[var(--accent)]"
                    href={contact.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {contact.instagram}
                  </a>

                  <a
                    className="block hover:text-[var(--accent)]"
                    href={contact.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {contact.website}
                  </a>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
                  WhatsApp
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:gap-5">
                  {(contact.whatsapp || []).map((item) => (
                    <a
                      key={item.label}
                      className="min-w-[170px] whitespace-nowrap border border-neutral-300 bg-white px-5 py-5 text-center text-sm font-semibold uppercase text-neutral-950 hover:border-[var(--accent)] hover:text-[var(--accent)] md:text-base lg:px-6"
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
