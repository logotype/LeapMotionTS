/// <reference path="./LeapEvent.ts"/>
/**
 * The EventDispatcher class provides strongly typed events.
 */
class EventDispatcher
{
    private listeners:any[];

    constructor()
    {
        this.listeners = [];
    }

    public hasEventListener( type:string, listener:Function ):boolean
    {
        var exists:boolean = false;
        for( var i:number = 0; i < this.listeners.length; i++ )
        {
            if( this.listeners[ i ].type === type && this.listeners[ i ].listener === listener )
            {
                exists = true;
                break;
            }
        }

        return exists;
    }

    public addEventListener ( typeStr:string, listenerFunction:Function ):void
    {
        if( this.hasEventListener( typeStr, listenerFunction ) )
            return;

        this.listeners.push( { type: typeStr, listener: listenerFunction } );
    }

    public removeEventListener ( typeStr:string, listenerFunction:Function ):void
    {
        for( var i:number = 0; i < this.listeners.length; i++ )
        {
            if( this.listeners[ i ].type === typeStr && this.listeners[ i ].listener === listenerFunction )
                this.listeners.splice( i, 1 );
        }
    }

    public dispatchEvent ( event:LeapEvent ):void
    {
        for( var i:number = 0; i < this.listeners.length; i++ )
        {
            if( this.listeners[ i ].type === event.getType() )
                this.listeners[ i ].listener.call( this, event );
        }
    }
}