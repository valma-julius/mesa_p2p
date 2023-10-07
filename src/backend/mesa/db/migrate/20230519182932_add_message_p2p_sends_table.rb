# frozen_string_literal: true

class AddMessageP2pSendsTable < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      CREATE TABLE "message_p2p_sends" (
        "id" BIGSERIAL PRIMARY KEY,
        "message_id" INTEGER NOT NULL, 
        "sender_id" INTEGER NOT NULL,
        "receiver_id" INTEGER NOT NULL,
        "created_at" TIMESTAMP(6) NOT NULL,
        "updated_at" TIMESTAMP(6) NOT NULL
      );
    SQL

    execute <<-SQL
      CREATE INDEX "index_message_p2p_sends_on_message_id" ON "message_p2p_sends" ("message_id");
    SQL
  end

  def down
    execute <<-SQL
      DROP INDEX "index_message_p2p_sends_on_message_id";
    SQL

    execute <<-SQL
      DROP TABLE "message_p2p_sends";
    SQL
  end
end
