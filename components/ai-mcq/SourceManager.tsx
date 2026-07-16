"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Upload,
  FileText,
  Trash2,
  Pencil,
  Check,
  X,
  Eye,
  Sparkles,
  Loader2,
  File,
} from "lucide-react";

import { useDropzone } from "react-dropzone";

interface SourceItem {
  id: string;
  name: string;
  type: string;
  text: string;
  size: number;
  createdAt: string;
  summary?: string;
  topics?: string[];
  duplicate?: boolean;
}

interface Props {
  onSourceChange?: (text: string) => void;
}

const STORAGE_KEY = "prepflow_ai_sources";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  return (
    Math.round(
      bytes /
        Math.pow(1024, index)
    ) +
    " " +
    units[index]
  );
}

function countWords(text: string) {
  if (!text.trim()) return 0;

  return text
    .trim()
    .split(/\s+/)
    .length;
}

function countCharacters(text: string) {
  return text.length;
}

function generateTopics(text: string) {
  const keywords = [
    "বাংলা",
    "ইংরেজি",
    "গণিত",
    "বিজ্ঞান",
    "ইতিহাস",
    "ভূগোল",
    "কম্পিউটার",
    "ব্যাংক",
    "BCS",
  ];

  return keywords.filter((word) =>
    text.includes(word)
  );
}

function createSummary(text: string) {
  if (!text.trim()) {
    return "No content available";
  }

  return text.slice(0, 180) + "...";
}

export default function SourceManager({
  onSourceChange,
}: Props) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [
    sources,
    setSources,
  ] = useState<SourceItem[]>([]);

  const [
    preview,
    setPreview,
  ] = useState<SourceItem | null>(null);

  const [
    renameId,
    setRenameId,
  ] = useState<string | null>(null);

  const [
    renameText,
    setRenameText,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);


  useEffect(() => {
    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) return;

    try {
      const data =
        JSON.parse(saved);

      setSources(data);
    } catch {}
  }, []);


  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(sources)
    );

    const combined =
      sources
        .map(
          (item) => item.text
        )
        .join("\n\n");

    onSourceChange?.(
      combined
    );
  }, [
    sources,
    onSourceChange,
  ]);


  const processFile =
    async (
      file: File
    ): Promise<SourceItem> => {

      let text = "";

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "";


      if (
        extension === "txt"
      ) {
        text =
          await file.text();
      }

      else if (
        extension === "pdf"
      ) {
        text =
          "PDF extraction will be processed.";
      }

      else if (
        extension === "docx"
      ) {
        text =
          "DOCX extraction will be processed.";
      }


      return {
        id:
          crypto.randomUUID(),

        name:
          file.name,

        type:
          extension,

        text,

        size:
          file.size,

        createdAt:
          new Date()
            .toISOString(),

        summary:
          createSummary(text),

        topics:
          generateTopics(text),
      };
    };


  const handleFiles =
    async (
      files: File[]
    ) => {

      setLoading(true);

      const validFiles =
        files.filter(
          (file) =>
            file.size <=
            MAX_FILE_SIZE
        );


      const items: SourceItem[] =
        [];


      for (
        const file of validFiles
      ) {
        items.push(
          await processFile(
            file
          )
        );
      }


      setSources(
        (prev) => [
          ...prev,
          ...items,
        ]
      );


      setLoading(false);
    };
      const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      await handleFiles(acceptedFiles);
    },
    [handleFiles]
  );


  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,

    multiple: true,

    accept: {
      "text/plain": [
        ".txt",
      ],

      "application/pdf": [
        ".pdf",
      ],

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [
          ".docx",
        ],
    },

    maxSize:
      MAX_FILE_SIZE,
  });


  const totalStats = useMemo(() => {
    const text =
      sources
        .map(
          (item) =>
            item.text
        )
        .join(" ");

    return {
      files:
        sources.length,

      characters:
        countCharacters(
          text
        ),

      words:
        countWords(
          text
        ),

      size:
        sources.reduce(
          (
            total,
            item
          ) =>
            total +
            item.size,
          0
        ),
    };
  }, [
    sources,
  ]);


  function removeSource(
    id: string
  ) {
    setSources(
      (prev) =>
        prev.filter(
          (item) =>
            item.id !== id
        )
    );

    if (
      preview?.id === id
    ) {
      setPreview(null);
    }
  }


  function startRename(
    item: SourceItem
  ) {
    setRenameId(
      item.id
    );

    setRenameText(
      item.name
    );
  }


  function saveRename(
    id: string
  ) {
    if (
      !renameText.trim()
    ) {
      return;
    }

    setSources(
      (prev) =>
        prev.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  name:
                    renameText.trim(),
                }
              : item
        )
    );

    setRenameId(null);
    setRenameText("");
  }


  function cancelRename() {
    setRenameId(null);
    setRenameText("");
  }


  function checkDuplicate(
    text: string,
    currentId: string
  ) {
    return sources.some(
      (item) =>
        item.id !== currentId &&
        item.text.trim() ===
          text.trim()
    );
  }


  useEffect(() => {
    if (!sources.length)
      return;

    setSources(
      (prev) =>
        prev.map(
          (item) => ({
            ...item,

            duplicate:
              checkDuplicate(
                item.text,
                item.id
              ),
          })
        )
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sources.length,
  ]);


  return (
    <div className="space-y-6">

      <div
        {...getRootProps()}
        className={`
          rounded-3xl
          border-2
          border-dashed
          p-8
          text-center
          cursor-pointer
          transition
          ${
            isDragActive
              ? "bg-amber-100 border-amber-500"
              : "bg-amber-50 border-amber-300"
          }
        `}
      >

        <input
          {...getInputProps()}
        />


        <Upload
          size={38}
          className="
            mx-auto
            mb-3
            text-amber-600
          "
        />


        <h3
          className="
            font-bold
            text-lg
          "
        >
          Upload Study Source
        </h3>


        <p
          className="
            text-sm
            text-gray-500
            mt-2
          "
        >
          Drag & Drop অথবা Click করুন
        </p>


        <p
          className="
            text-xs
            mt-1
            text-gray-400
          "
        >
          TXT • PDF • DOCX
          (Max 10MB)
        </p>


        {
          loading && (
            <div
              className="
                flex
                justify-center
                items-center
                gap-2
                mt-4
                text-amber-700
              "
            >
              <Loader2
                className="
                  animate-spin
                "
                size={18}
              />

              Processing...
            </div>
          )
        }

      </div>
            <div
        className="
          rounded-2xl
          border
          border-amber-200
          bg-white
          p-5
          shadow-sm
        "
      >

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
          "
        >

          <div>
            <p
              className="
                text-xs
                text-gray-500
              "
            >
              Files
            </p>

            <p
              className="
                font-bold
                text-xl
              "
            >
              {totalStats.files}
            </p>
          </div>


          <div>
            <p
              className="
                text-xs
                text-gray-500
              "
            >
              Words
            </p>

            <p
              className="
                font-bold
                text-xl
              "
            >
              {totalStats.words}
            </p>
          </div>


          <div>
            <p
              className="
                text-xs
                text-gray-500
              "
            >
              Characters
            </p>

            <p
              className="
                font-bold
                text-xl
              "
            >
              {totalStats.characters}
            </p>
          </div>


          <div>
            <p
              className="
                text-xs
                text-gray-500
              "
            >
              Storage
            </p>

            <p
              className="
                font-bold
                text-xl
              "
            >
              {formatBytes(
                totalStats.size
              )}
            </p>
          </div>

        </div>

      </div>



      {
        sources.length === 0 && (
          <div
            className="
              rounded-3xl
              border
              border-dashed
              border-amber-200
              bg-amber-50
              p-10
              text-center
            "
          >

            <File
              size={42}
              className="
                mx-auto
                mb-3
                text-amber-500
              "
            />

            <h3
              className="
                font-semibold
              "
            >
              No Source Added
            </h3>


            <p
              className="
                text-sm
                text-gray-500
                mt-2
              "
            >
              Upload your study materials
              to generate AI MCQ.
            </p>

          </div>
        )
      }



      <div
        className="
          space-y-4
        "
      >

        {
          sources.map(
            (item) => (
              <div
                key={
                  item.id
                }
                className="
                  rounded-2xl
                  border
                  border-amber-200
                  bg-white
                  p-5
                  shadow-sm
                "
              >

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >

                    <FileText
                      size={24}
                      className="
                        mt-1
                        text-amber-600
                      "
                    />


                    <div>

                      {
                        renameId ===
                        item.id ? (
                          <div
                            className="
                              flex
                              gap-2
                            "
                          >

                            <input
                              value={
                                renameText
                              }
                              onChange={
                                (e) =>
                                  setRenameText(
                                    e.target.value
                                  )
                              }
                              className="
                                rounded-lg
                                border
                                px-3
                                py-1
                                text-sm
                              "
                            />


                            <button
                              onClick={() =>
                                saveRename(
                                  item.id
                                )
                              }
                            >

                              <Check
                                size={18}
                                className="
                                  text-green-600
                                "
                              />

                            </button>


                            <button
                              onClick={
                                cancelRename
                              }
                            >

                              <X
                                size={18}
                                className="
                                  text-red-500
                                "
                              />

                            </button>

                          </div>

                        ) : (

                          <p
                            className="
                              font-semibold
                            "
                          >
                            {item.name}
                          </p>

                        )
                      }


                      <p
                        className="
                          text-xs
                          text-gray-500
                          mt-1
                        "
                      >
                        {item.type.toUpperCase()}
                        {" • "}
                        {formatBytes(
                          item.size
                        )}
                      </p>


                      {
                        item.duplicate && (
                          <span
                            className="
                              inline-block
                              mt-2
                              rounded-full
                              bg-red-100
                              px-3
                              py-1
                              text-xs
                              text-red-600
                            "
                          >
                            Duplicate Source
                          </span>
                        )
                      }


                      <div
                        className="
                          flex
                          flex-wrap
                          gap-2
                          mt-3
                        "
                      >

                        {
                          item.topics?.map(
                            (
                              topic
                            ) => (
                              <span
                                key={
                                  topic
                                }
                                className="
                                  rounded-full
                                  bg-amber-100
                                  px-3
                                  py-1
                                  text-xs
                                  text-amber-700
                                "
                              >
                                {topic}
                              </span>
                            )
                          )
                        }

                      </div>

                    </div>

                  </div>



                  <div
                    className="
                      flex
                      gap-2
                    "
                  >

                    <button
                      onClick={() =>
                        setPreview(
                          item
                        )
                      }
                    >

                      <Eye
                        size={18}
                        className="
                          text-blue-500
                        "
                      />

                    </button>


                    <button
                      onClick={() =>
                        startRename(
                          item
                        )
                      }
                    >

                      <Pencil
                        size={18}
                        className="
                          text-amber-600
                        "
                      />

                    </button>


                    <button
                      onClick={() =>
                        removeSource(
                          item.id
                        )
                      }
                    >

                      <Trash2
                        size={18}
                        className="
                          text-red-500
                        "
                      />

                    </button>

                  </div>

                </div>

              </div>
            )
          )
        }

      </div>
            {
        preview && (
          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/40
              p-4
            "
          >

            <div
              className="
                w-full
                max-w-2xl
                rounded-3xl
                bg-white
                p-6
                shadow-xl
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <Sparkles
                    size={22}
                    className="
                      text-amber-600
                    "
                  />

                  <h2
                    className="
                      font-bold
                      text-xl
                    "
                  >
                    Source Preview
                  </h2>

                </div>


                <button
                  onClick={() =>
                    setPreview(null)
                  }
                >

                  <X
                    size={22}
                    className="
                      text-gray-500
                    "
                  />

                </button>

              </div>



              <div
                className="
                  space-y-4
                "
              >

                <div>

                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    File Name
                  </p>

                  <p
                    className="
                      font-semibold
                    "
                  >
                    {preview.name}
                  </p>

                </div>



                <div>

                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    AI Summary
                  </p>

                  <p
                    className="
                      rounded-xl
                      bg-amber-50
                      p-4
                      text-sm
                    "
                  >
                    {preview.summary}
                  </p>

                </div>



                <div>

                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    Statistics
                  </p>


                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-3
                      mt-2
                    "
                  >

                    <div
                      className="
                        rounded-xl
                        bg-gray-50
                        p-3
                      "
                    >

                      <p
                        className="
                          text-xs
                          text-gray-500
                        "
                      >
                        Words
                      </p>

                      <p
                        className="
                          font-bold
                        "
                      >
                        {
                          countWords(
                            preview.text
                          )
                        }
                      </p>

                    </div>



                    <div
                      className="
                        rounded-xl
                        bg-gray-50
                        p-3
                      "
                    >

                      <p
                        className="
                          text-xs
                          text-gray-500
                        "
                      >
                        Characters
                      </p>

                      <p
                        className="
                          font-bold
                        "
                      >
                        {
                          countCharacters(
                            preview.text
                          )
                        }
                      </p>

                    </div>

                  </div>

                </div>



                <div>

                  <p
                    className="
                      text-sm
                      text-gray-500
                      mb-2
                    "
                  >
                    Content Preview
                  </p>


                  <div
                    className="
                      max-h-60
                      overflow-y-auto
                      rounded-xl
                      bg-gray-50
                      p-4
                      text-sm
                      whitespace-pre-wrap
                    "
                  >
                    {
                      preview.text ||
                      "No extracted text available."
                    }
                  </div>

                </div>


              </div>



              <button
                onClick={() =>
                  setPreview(null)
                }
                className="
                  mt-6
                  w-full
                  rounded-xl
                  bg-amber-500
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-amber-600
                "
              >
                Close Preview
              </button>


            </div>

          </div>
        )
      }

    </div>
  );
}