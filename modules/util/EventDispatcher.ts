/// <reference path="./LeapEvent.ts"/>
/**
 * The EventDispatcher class provides strongly typed events.
 */
class EventDispatcher
{
    private _listeners:any[];

    constructor()
    {
        this._listeners = [];
    }

    public hasEventListener( type:string, listener:Function ):boolean
    {
        var exists:boolean = false;
        for( var i:number = 0; i < this._listeners.length; i++ )
        {
            if( this._listeners[ i ].type === type && this._listeners[ i ].listener === listener )
            {
                exists = true;
                break;
            }
        }

        return exists;
    }

    public addEventListener ( typeStr:string, listenerFunc:Function ):void
    {
        if( this.hasEventListener( typeStr, listenerFunc ) )
            return;

        this._listeners.push( { type: typeStr, listener: listenerFunc } );
    }

    public removeEventListener ( typeStr:string, listenerFunc:Function ):void
    {
        for( var i:number = 0; i < this._listeners.length; i++ )
        {
            if( this._listeners[ i ].type === typeStr && this._listeners[ i ].listener === listenerFunc )
                this._listeners.splice( i, 1 );
        }
    }

    public dispatchEvent ( evt:LeapEvent ):void
    {
        for( var i:number = 0; i < this._listeners.length; i++ )
        {
            if( this._listeners[ i ].type === evt.getType() )
                this._listeners[ i ].listener.call( this, evt );
        }
    }
}