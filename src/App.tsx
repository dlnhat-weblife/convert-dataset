import { useState, useRef, useMemo, useEffect } from "react";
import { parse } from "papaparse";
import { CSVLink, CSVDownload } from "react-csv";

enum SaleTranDetail {
  COMPANY_CODE = "COMPANY_CODE",
  CHANNEL_CODE = "CHANNEL_CODE",
  STORE_CODE = "STORE_CODE",
  SALES_DATE = "SALES_DATE",
  TRAN_NO = "TRAN_NO",
  TRAN_DETAIL_SEQ_NO = "TRAN_DETAIL_SEQ_NO",
  TRAN_DETAIL_TYPE_CD = "TRAN_DETAIL_TYPE_CD",
  TRAN_DETAIL_TYPE_NAME = "TRAN_DETAIL_TYPE_NAME",
  PRODUCT_CD = "PRODUCT_CD",
  PRODUCT_NAME = "PRODUCT_NAME",
  UNIT_PRICE = "UNIT_PRICE",
  SALES_QTY = "SALES_QTY",
  SALES_PRICE_LEVEL = "SALES_PRICE_LEVEL",
  SALES_UNIT_PRICE = "SALES_UNIT_PRICE",
  SALES_AMNT_INTAX = "SALES_AMNT_INTAX",
  SALES_AMNT = "SALES_AMNT",
  SALES_TAX = "SALES_TAX",
  TAX_FLG = "TAX_FLG",
  PURCHASE_USE_DETAIL = "PURCHASE_USE_DETAIL",
  DISCOUNT_REASON = "DISCOUNT_REASON",
  ACQUISITION_DATE = "ACQUISITION_DATE",
}

enum SaleTran {
  COMPANY_CD = "COMPANY_CD",
  CHANNEL_CD = "CHANNEL_CD",
  STORE_CD = "STORE_CD",
  SALES_DATE = "SALES_DATE",
  TRAN_NO = "TRAN_NO",
  STAFF_CD = "STAFF_CD",
  TRAN_TYPE_CD = "TRAN_TYPE_CD",
  TRAN_TYPE_NAME = "TRAN_TYPE_NAME",
  CUST_CNT = "CUST_CNT",
  FEE = "FEE",
  COD = "COD",
  SALES_TIME = "SALES_TIME",
  CUST_ID = "CUST_ID",
  PURCHASE_USE = "PURCHASE_USE",
  ACQUISITION_DATE = "ACQUISITION_DATE",
}

enum CustomerData {
  CUST_ID_EC = "CUST_ID_EC",
  EMAIL_ADDRESS = "EMAIL_ADDRESS",
}

const SALES_TRAN_DETAIL = new Map<string, { [key: string]: string }>();
const SALES_TRAN = new Map<string, { [key: string]: string }>();
const CUSTOMER_DATA = new Map<string, { [key: string]: string }>();

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [file3, setFile3] = useState<File | null>(null);

  const [parseComplete, setParseComplete] = useState({
    file1: false,
    file2: false,
    file3: false,
  });

  const [csvData, setCsvData] = useState([] as any[]);

  const handleFileSelected =
    (onSuccess: any) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (e.target.files) onSuccess(e.target.files[0]);
    };

  const handleParse = () => {
    // if (!file || !file2) return;
    parse(file as any, {
      complete(results) {
        const header = results.data[0] as Array<string>;
        const data = results.data.slice(1) as Array<string>;

        const index_TRAN_NO = header.indexOf(SaleTranDetail.TRAN_NO);
        const index_TRAN_DETAIL_SEQ_NO = header.indexOf(
          SaleTranDetail.TRAN_DETAIL_SEQ_NO
        );
        const index_SALES_DATE = header.indexOf(SaleTranDetail.SALES_DATE);
        const index_PRODUCT_CD = header.indexOf(SaleTranDetail.PRODUCT_CD);
        const index_PRODUCT_NAME = header.indexOf(SaleTranDetail.PRODUCT_NAME);
        const index_UNIT_PRICE = header.indexOf(SaleTranDetail.UNIT_PRICE);
        const index_SALES_QTY = header.indexOf(SaleTranDetail.SALES_QTY);
        const index_SALES_AMNT = header.indexOf(SaleTranDetail.SALES_AMNT);
        const index_SALES_TAX = header.indexOf(SaleTranDetail.SALES_TAX);

        data.forEach((row) => {
          const key = `${row[index_TRAN_NO]}--${row[index_TRAN_DETAIL_SEQ_NO]}`;
          SALES_TRAN_DETAIL.set(key, {
            [SaleTranDetail.TRAN_NO]: row[index_TRAN_NO],
            [SaleTranDetail.TRAN_DETAIL_SEQ_NO]: row[index_TRAN_DETAIL_SEQ_NO],
            [SaleTranDetail.SALES_DATE]: row[index_SALES_DATE],
            [SaleTranDetail.PRODUCT_CD]: row[index_PRODUCT_CD],
            [SaleTranDetail.PRODUCT_NAME]: row[index_PRODUCT_NAME],
            [SaleTranDetail.UNIT_PRICE]: row[index_UNIT_PRICE],
            [SaleTranDetail.SALES_QTY]: row[index_SALES_QTY],
            [SaleTranDetail.SALES_AMNT]: row[index_SALES_AMNT],
            [SaleTranDetail.SALES_TAX]: row[index_SALES_TAX],
          });
        });

        console.log("Parsing SALES_TRAN_DETAIL complete");
        setParseComplete((prev) => ({ ...prev, file1: true }));
      },
    });
    parse(file2 as any, {
      // header: true,
      complete(results) {
        const header = results.data[0] as Array<string>;
        const data = results.data.slice(1) as Array<string>;

        const index_CUST_ID = header.indexOf(SaleTran.CUST_ID);
        const index_TRAN_NO = header.indexOf(SaleTran.TRAN_NO);

        data.forEach((row) => {
          const key = `${row[index_TRAN_NO]}`;
          if (SALES_TRAN.get(key)) {
            console.log(
              "not unique",
              key,
              row[index_TRAN_NO],
              row[index_CUST_ID]
            );
          }
          SALES_TRAN.set(key, {
            [SaleTran.CUST_ID]: row[index_CUST_ID],
          });
        });
        console.log("Parsing SALES_TRAN complete");
        setParseComplete((prev) => ({ ...prev, file2: true }));
      },
    });
    parse(file3 as any, {
      // header: true,
      complete(results) {
        const header = results.data[0] as Array<string>;
        const data = results.data.slice(1) as Array<string>;

        const index_CUST_ID_EC = header.indexOf(CustomerData.CUST_ID_EC);
        const index_EMAIL_ADDRESS = header.indexOf(CustomerData.EMAIL_ADDRESS);

        data.forEach((row) => {
          const key = row[index_CUST_ID_EC];
          CUSTOMER_DATA.set(key, {
            [CustomerData.EMAIL_ADDRESS]: row[index_EMAIL_ADDRESS],
          });
        });

        console.log("Parsing CUSTOMER_DATA complete", results);
        setParseComplete((prev) => ({ ...prev, file3: true }));
      },
    });
  };

  useEffect(() => {
    if (Object.values(parseComplete).some((v) => !v)) return;
    const header = [
      "retail.cust_id",
      "Email",
      "Number",
      "Tags",
      "Tags Command",
      "Created At",
      "Line: Type",
      "Line: Product Handle",
      "Line: Title",
      "Line: Price",
      "Line: Quantity",
      "Line: Total",
      "Tax: Included",
      "Tax: Total",
      "Payment: Status",
      "Line: Taxable",
      "Line: Requires Shipping",
      "Order Fulfillment Status",
      "Fulfillment: Status",
    ];
    const data = [];
    while (SALES_TRAN_DETAIL.size) {
      const [key_SALES_TRAN_DETAIL, value_SALES_TRAN_DETAIL] =
        SALES_TRAN_DETAIL.entries().next().value;
      const value_SALES_TRAN = SALES_TRAN.get(
        value_SALES_TRAN_DETAIL[SaleTranDetail.TRAN_NO]
      );
      const value_CUSTOMER_DATA = CUSTOMER_DATA.get(value_SALES_TRAN?.CUST_ID!);

      data.push([
        value_SALES_TRAN?.CUST_ID || "",
        value_CUSTOMER_DATA?.EMAIL_ADDRESS || "",
        value_SALES_TRAN_DETAIL[SaleTranDetail.TRAN_NO] || "",
        value_SALES_TRAN_DETAIL[SaleTranDetail.STORE_CODE] + ",実店舗" || "",
        "REPLACED",
        value_SALES_TRAN_DETAIL[SaleTranDetail.SALES_DATE] || "",
        "Line Item",
        value_SALES_TRAN_DETAIL[SaleTranDetail.PRODUCT_CD] || "",
        value_SALES_TRAN_DETAIL[SaleTranDetail.PRODUCT_NAME] || "",
        value_SALES_TRAN_DETAIL[SaleTranDetail.UNIT_PRICE] || "",
        value_SALES_TRAN_DETAIL[SaleTranDetail.SALES_QTY] || "",
        value_SALES_TRAN_DETAIL[SaleTranDetail.SALES_UNIT_PRICE] || "",
        "FALSE",
        value_SALES_TRAN_DETAIL[SaleTranDetail.SALES_TAX] || "",
        "paid",
        "TRUE",
        "FALSE",
        "fulfilled",
        "success",
      ]);

      SALES_TRAN_DETAIL.delete(key_SALES_TRAN_DETAIL);
    }
    setCsvData([header, ...data]);
  }, [parseComplete]);

  return (
    <div className="w-full h-screen bg-slate-100 p-10">
      <h1>hello world</h1>
      <div className="flex">
        <div>
          <label>Input file 1</label>
          <input type="file" onChange={handleFileSelected(setFile)} />
        </div>
        <div>
          <label>Input file 2</label>
          <input type="file" onChange={handleFileSelected(setFile2)} />
        </div>
        <div>
          <label>Input file 3</label>
          <input type="file" onChange={handleFileSelected(setFile3)} />
        </div>
      </div>
      <div className="flex gap-10">
        <button onClick={handleParse}>Parse</button>
        {csvData.length > 0 && <CSVLink data={csvData}>Download me</CSVLink>}
      </div>
    </div>
  );
}

export default App;
