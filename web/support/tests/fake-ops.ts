// En falsk udgave af selfiebox-platforms tekniske værktøjer (lib/support-ops) til testsamtalerne: samme navne,
// samme afgrænsning (kun bokse på kundens egne bookinger) og samme forslag → ja → udfør, men ingen rigtige bokse.
// Bo Madsens booking (SB-261002-BO, leveret) har boksen "selfi-test-1", der er online med frossen skærm.

import type { OpsClient, OpsToolDef } from "../../lib/support/ops";

const obj = (properties: Record<string, unknown>) => ({ type: "object", properties, required: Object.keys(properties), additionalProperties: false });
const tool = (name: string, description: string, properties: Record<string, unknown>): OpsToolDef => ({ type: "function", name, description, strict: true, parameters: obj(properties) });
const CONFIRM = { type: ["string", "null"], description: "null første gang; derefter confirmId fra forslaget, efter kundens ja i en ny besked" };

const TOOLS: OpsToolDef[] = [
  tool("get_box_status", "Teknisk status for kundens bokse (online, skærm, kamera, upload, net, strøm). Kald før du gætter på en fejl.", { target: { type: ["string", "null"] } }),
  tool("restart_box", "Genstarter en af kundens bokse (app ca. 20 sek., reboot 1-2 min.). Kræver ja: første kald giver et forslag, kald igen med confirmId efter kundens ja.", { box: { type: "string" }, kind: { type: "string", enum: ["app", "reboot"] }, confirmId: CONFIRM }),
  tool("wake_box", "Vækker en boks, der hviler.", { box: { type: "string" } }),
  tool("send_photos_now", "Beder boksen sende billeder i kø nu.", { box: { type: "string" } }),
];

/** Kald og udførte handlinger, så testene kan tjekke dem. */
export const opsLog: { calls: string[]; executed: string[] } = { calls: [], executed: [] };

export function fakeOps(): OpsClient {
  const proposals = new Map<string, { at: number; box: string }>();
  return {
    tools: async () => ({ tools: TOOLS, labels: { get_box_status: "Tjekker boksen…", restart_box: "Genstarter boksen…" } }),
    async call(name, body) {
      opsLog.calls.push(name);
      const scope = body.scope as { bookings: string[] } | null;
      const session = body.session as { lastCustomerAt: string | null };
      const args = body.args as Record<string, string | null>;
      if (!scope || !scope.bookings.length) return { ok: false, message: "Kunden er ikke verificeret." };
      const mine = scope.bookings.includes("SB-261002-BO");
      if (name === "get_box_status") {
        if (!mine) return { ok: true, boxes: [], message: "Kunden har ingen bokse ude lige nu." };
        return { ok: true, boxes: [{ box: "selfi-test-1", name: "Selfi Boks 1", for: "Boksen til booking SB-261002-BO", online: true, lastSeen: "lige nu", overall: "fejl", asleep: false, screen: "Kører", checks: [{ label: "Skærm", level: "bad", value: "Svarer ikke" }, { label: "Kamera", level: "ok", value: "30 fps" }], lastPhoto: "for 25 min. siden" }] };
      }
      if (!mine || args.box !== "selfi-test-1") return { ok: false, message: "Den boks hører ikke til den verificerede kunde." };
      if (name === "restart_box") {
        if (!args.confirmId) {
          const id = `c${proposals.size + 1}`;
          proposals.set(id, { at: Date.now(), box: args.box });
          return { ok: true, needsConfirm: true, confirmId: id, summary: "Genstart programmet på Selfi Boks 1 (skærmen er sort ca. 20 sekunder)" };
        }
        const p = proposals.get(args.confirmId);
        if (!p) return { ok: false, message: "Ukendt confirmId." };
        if (!session.lastCustomerAt || Date.parse(session.lastCustomerAt) <= p.at) return { ok: false, reason: "no_answer_yet", message: "Kunden har ikke svaret endnu." };
        opsLog.executed.push(`restart_box:${args.kind}`);
        return { ok: true, message: "Programmet genstarter. Skærmen er tilbage om ca. 20 sekunder." };
      }
      opsLog.executed.push(name);
      return { ok: true };
    },
  };
}
