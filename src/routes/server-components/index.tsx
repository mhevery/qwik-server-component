import {
  component$,
  useComputed$,
  useSignal,
  useStyles$,
} from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import STYLES from "./index.css?inline";

interface Person {
  id: string;
  name: string;
  age: number;
  location: string;
}

export const useIsStatic = routeLoader$(({ url }) => {
  return (url.searchParams.get("static") || "false") == "true";
});

export const usePeople = routeLoader$(({ url }) => {
  const size = Number(url.searchParams.get("size") || "100");
  const people: Person[] = [];
  for (let i = 0; i < size; i++) {
    people.push({
      id: String(i),
      name: randomWord() + " " + randomWord() + " " + randomWord(),
      age: Math.round(Math.random() * 100),
      location: randomWord() + randomWord(),
    });
  }
  return people;
});

export default component$(() => {
  return (
    <div>
      <p>
        This is a test of how long it takes Qwik to process first interaction.
        The test tries to click on the two buttons as eagerly as possible and
        measures the amount of time before the click handler runs and UI gets
        updated. The second button is identical test, but shows difference
        between cold start (paused) vs warm start (resumed). The difference
        between the first and second test is the cost of resuming the state and
        parsing the Qwik source for the first time.
      </p>
      <h1>Table</h1>
      <TableDemo />
      <div></div>
      <h1>Test Footer</h1>
      <InteractionTest id="1" />
      <InteractionTest id="2" />
      <pre id="consoleLog" />
    </div>
  );
});

export const InteractionTest = component$<{ id: string }>(({ id }) => {
  const show = useSignal(false);
  return (
    <div>
      <button
        id={"interaction-button-" + id}
        disabled={show.value}
        onClick$={(e) => {
          "detail" in e && typeof e.detail === "function" && e.detail();
          show.value = true;
        }}
      >
        Show {id}
      </button>
      {show.value && (
        <span id={"interaction-rendering-" + id}>Client rendered {id}</span>
      )}
    </div>
  );
});

const WORDS = [
  "lorem",
  "ipsum",
  "plurum",
  "pas",
  "or",
  "athm",
  "con",
  "laso",
  "daum",
  "fun",
  "arum",
  "malu",
  "var",
];

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

const TableDemo = component$(() => {
  useStyles$(STYLES);
  const isStatic = useIsStatic();
  const filter = useSignal("");
  const people = usePeople();
  const fPeople = useComputed$(() => {
    const contains = (text: string | number, fragment: string) =>
      String(text).toLowerCase().indexOf(fragment) !== -1;
    return people.value.filter((person: Person) => {
      const text = filter.value.toLowerCase();
      return (
        contains(person.age, text) ||
        contains(person.name, text) ||
        contains(person.location, text)
      );
    });
  });
  return (
    <div>
      {!isStatic.value && (
        <span>
          <label>Filter:</label> <input bind:value={filter} />{" "}
        </span>
      )}
      showing {fPeople.value.length} of {people.value.length} records.
      <ul class="table">
        <li class="row header">
          <div class="action"></div>
          <div class="name">Name</div>
          <div class="age">Age</div>
          <div class="location">Location</div>
        </li>
        {fPeople.value.map((person) => (
          <Row key={person.id} data={person} />
        ))}
      </ul>
    </div>
  );
});

const Row = component$<{
  data: Person;
}>(({ data }) => {
  const isStatic = useIsStatic();
  const locked = useSignal(false);
  return (
    <li class="row">
      <div class="action">
        {!isStatic.value && (
          <button onClick$={() => (locked.value = !locked.value)}>
            {locked.value ? "🔐" : "🔓"}
          </button>
        )}
      </div>
      <div class="name">{data.name}</div>
      <div class="age">{data.age}</div>
      <div class="location">{data.location}</div>
    </li>
  );
});
